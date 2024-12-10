import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../services/supabase";
import lodash from "lodash";

export function useData() {
  const [data, setData] = useState({
    staffs: [],
    partners: [],
    departments: [],
    correspondences: [],
    responses: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const dataCache = useRef({
    timestamp: null,
    data: null,
    // Cache duration in milliseconds (5 minutes)
    maxAge: 5 * 60 * 1000,
  });

  // Debounced update function to prevent rapid re-fetches
  const debouncedFetchTable = useCallback(
    lodash.debounce((table) => fetchTableData(table), 1000, {
      leading: true,
      trailing: false,
    }),
    []
  );

  const isCacheValid = useCallback(() => {
    return (
      dataCache.current.timestamp &&
      dataCache.current.data &&
      Date.now() - dataCache.current.timestamp < dataCache.current.maxAge
    );
  }, []);

  const fetchTableData = async (table) => {
    try {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });

      if (tableError) throw tableError;

      setData((prev) => {
        const newData = { ...prev, [table]: tableData || [] };
        // Update cache
        dataCache.current = {
          timestamp: Date.now(),
          data: newData,
        };
        return newData;
      });
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(err.message);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const tables = [
        "staffs",
        "partners",
        "departments",
        "correspondences",
        "responses",
        "notifications",
      ];

      // Use Promise.allSettled instead of Promise.all to handle partial failures
      const results = await Promise.allSettled(
        tables.map((table) =>
          supabase
            .from(table)
            .select("*")
            .order("created_at", { ascending: false })
        )
      );

      const fetchedData = tables.reduce((acc, table, index) => {
        const result = results[index];
        if (result.status === "fulfilled" && !result.value.error) {
          acc[table] = result.value.data || [];
        } else {
          console.error(
            `Error fetching ${table}:`,
            result.reason || result.value.error
          );
          acc[table] = [];
        }
        return acc;
      }, {});

      setData(fetchedData);
      // Update cache
      dataCache.current = {
        timestamp: Date.now(),
        data: fetchedData,
      };
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // New refresh function
  const refresh = useCallback(
    async (forceFetch = false) => {
      // Prevent multiple simultaneous refreshes
      if (isRefreshing) return;

      setIsRefreshing(true);

      // If forceFetch is false, check cache validity
      if (!forceFetch && isCacheValid()) {
        setData(dataCache.current.data);
        setIsRefreshing(false);
        return;
      }

      // Clear cache
      dataCache.current = {
        timestamp: null,
        data: null,
      };

      // Fetch fresh data
      await fetchAllData();
    },
    [isRefreshing, isCacheValid]
  );

  useEffect(() => {
    let isSubscribed = true;

    // Initial data fetch
    fetchAllData();

    const channel = supabase.channel("custom-all-channel");
    const tables = [
      "staffs",
      "partners",
      "departments",
      "correspondences",
      "responses",
      "notifications",
    ];

    // Optimized real-time updates
    tables.forEach((table) => {
      channel.on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        (payload) => {
          if (!isSubscribed) return;

          // Update single record instead of fetching entire table
          setData((prev) => {
            const tableData = [...prev[table]];

            switch (payload.eventType) {
              case "INSERT":
                tableData.unshift(payload.new);
                break;
              case "UPDATE":
                const updateIndex = tableData.findIndex(
                  (item) => item.id === payload.new.id
                );
                if (updateIndex !== -1) {
                  tableData[updateIndex] = payload.new;
                }
                break;
              case "DELETE":
                const deleteIndex = tableData.findIndex(
                  (item) => item.id === payload.old.id
                );
                if (deleteIndex !== -1) {
                  tableData.splice(deleteIndex, 1);
                }
                break;
            }

            const newData = { ...prev, [table]: tableData };
            // Update cache with real-time changes
            dataCache.current = {
              timestamp: Date.now(),
              data: newData,
            };
            return newData;
          });
        }
      );
    });

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("Successfully subscribed to all tables");
      }
    });

    return () => {
      isSubscribed = false;
      debouncedFetchTable.cancel();
      supabase.removeChannel(channel);
    };
  }, [debouncedFetchTable]);

  return { data, loading, error, isRefreshing, refresh };
}
