/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function DataTable({
  rows = [],
  columns = [],
  searchKeys = [],
  caption,
  itemsPerPage = 5,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (!Array.isArray(rows) || rows.length === 0) {
    return <div>No data available</div>;
  }

  const filteredRows = rows.filter((row) =>
    searchKeys.some((key) =>
      String(row[key] || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-md">{caption}</h3>
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-stone-900" />
          <input
            type="text"
            placeholder="Search by name | type "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-70 pl-10 pr-5 py-1 border text-sm font-normal border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-80 border rounded-md">
        <Table className="table-auto w-full">
          <TableHeader className="sticky top-0 bg-[#edf4f5] shadow">
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className="text-teal-500 sticky top-0">
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] || "N/A"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <p className="text-sm text-muted-foreground">
          Showing {currentPage} of {totalPages} entries
        </p>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="text-muted-foreground hover:text-foreground"
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 p-0 ${
                  currentPage === page
                    ? "bg-teal-500 text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="text-muted-foreground hover:text-foreground"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
