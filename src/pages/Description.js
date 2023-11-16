import DescriptionTable from "../components/DescriptionTable";
import TableFooter from "../components/TableFooter";
import { useEffect, useState } from "react";
import axios from "axios";

const Description = () => {
  const [inputValues, setInputValues] = useState({});
  const [displayTableData, setTableData] = useState([]);
  const [flag, setFlag] = useState();

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ROOT + "getDescription")
      .then((response) => {
        if (response["status"] == "200") {
          console.log(response["data"]["result"]);
          setTableData(response["data"]["result"]);
        }
      });
  }, [flag]);

  const handleFlag = (flag) => {
    setFlag(flag);
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputValues((values) => ({ ...values, [name]: value }));
  };
  const handleClick = () => {
    axios
      .post(process.env.REACT_APP_API_ROOT + "addDescription", inputValues)
      .then((response) => {
        if (response["data"]["status"] == "200") {
          setInputValues({ title: "", description: "" });
          setFlag(Date.now());
        }
        if (response["data"]["status"] == "500") {
        }
      });
  };

  const tableHeaders = ["ID", "タイトル", "アクション"];

  return (
    <div className="flex flex-row">
      <div class=" bg-gray-100 flex flex-col justify-center sm:py-12">
        <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 class="font-bold text-center text-2xl mb-5">
            説明テンプレートを入力してください。
          </h1>{" "}
          <div class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
            <div class="px-5 py-7">
              <label class="font-semibold text-sm text-gray-600 pb-1 float-left">
                タイトル
              </label>
              <input
                type="text"
                class="border border-slate-600 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                name="title"
                value={inputValues["title"] || ""}
                onChange={handleChange}
              />
              <label class="font-semibold text-sm text-gray-600 pb-1 float-left">
                説明文
              </label>
              <textarea
                type="textarea"
                rows="6"
                cols="50"
                class="border border-slate-600 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                name="description"
                value={inputValues["description"] || ""}
                onChange={handleChange}
              />
              <button
                type="button"
                class="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                onClick={handleClick}
              >
                <span class="inline-block mr-2">保存</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-4 h-4 inline-block"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class=" bg-gray-100 flex flex-col w-[60%] justify-center sm:py-12">
        <DescriptionTable
          tableHeaders={tableHeaders}
          tableData={displayTableData}
          setFlag={setFlag}
          // isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Description;
