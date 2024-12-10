/* eslint-disable no-unused-vars */
import  { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, ConfigProvider } from "antd";
import Highlighter from "react-highlight-words";
import { Button as ShadButton } from "@/components/ui/button";
import AddForm from "./Form";

const StaffTable = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [showForm, setShowForm] = useState(false);

  const searchInput = useRef(null);

  // Dummy data
  const directorates = [
    { id: 1, name: "Directorate X" },
    { id: 2, name: "Directorate Y" },
  ];

  const staffs = [
    {
      id: 1,
      name: "Staff 1",
      directorate_id: 1,
      phone: "123-456-7890",
      email: "staff1@example.com",
    },
    {
      id: 2,
      name: "Staff 2",
      directorate_id: 2,
      phone: "987-654-3210",
      email: "staff2@example.com",
    },
    {
      id: 3,
      name: "Staff 3",
      directorate_id: 1,
      phone: "555-555-5555",
      email: "staff3@example.com",
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Directorate",
      key: "directorate",
      render: (_, record) => {
        const directorate = directorates.find(
          (directorate) => directorate.id === record.directorate_id
        );
        return <div>{directorate?.name || "N/A"}</div>;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#008080",
            borderRadius: 7,
            colorBgContainer: "#ffff",
            fontFamily: "Montserrat",
          },
        }}
      >
        <div className="w-full">
          <div className="flex flex-col space-y-4">
            <div
              className="flex justify-end items-center mb-5"
              onClick={() => setShowForm(true)}
            >
              <ShadButton className="bg-bgPrimary text-white font-normal px-4 py-6">
                <img
                  src="/icons/whiteCross.svg"
                  className="w-4 h-4"
                  alt="add"
                />
                Add Staff
              </ShadButton>
            </div>

            {showForm && (
              <AddForm
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                activeTab={"Staff"}
              />
            )}

            <Table
              columns={columns}
              dataSource={staffs}
              rowKey="id"
              scroll={{ x: "max-content" }}
              className="font-semibold"
              style={{
                backgroundColor: "transparent",
              }}
            />
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default StaffTable;
