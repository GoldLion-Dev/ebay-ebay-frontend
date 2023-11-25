import { useEffect, useState, useRef } from "react";
import ListTable from "../components/ListTable";
import TableFooter from "../components/TableFooter";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import ExtractingLoader from "../components/ExtractingLoader";
import { resetPagnation } from "./listingSlice";

const Dashboard = () => {
  const [sellerPolicy, setSellerPolicy] = useState([]);
  const [description, setDescription] = useState([]);
  const [optionTexts, setOptionText] = useState({});
  const [tableData, setTableData] = useState([]);
  const [descriptionOption, setDescriptionOption] = useState();
  const [isLoading, setLoading] = useState();
  const [disable, setDisable] = useState(false);
  const [extractedCount, setExtractedCount] = useState(0);
  const [totalCount, setTotalCount] = useState();
  const [deleteLogId, setDeleteLog] = useState();
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  // const profitElement = useRef();
  const dispatch = useDispatch();
  const countRef = useRef();
  const storeElement = useRef();
  const countPerPage = useSelector((state) => state.listing.countPerPage);
  const activePage = useSelector((state) => state.listing.activePage);
  const isProcessing = useSelector((state) => state.listing.isProcessing);

  const [count, setCount] = useState(0);

  const [isLoad, setLoad] = useState(false);
  let newSocket;
  useEffect(() => {
    newSocket = new WebSocket("ws://57.180.142.77/ws/");
    setSocket(newSocket);
    setLoad(true);
    console.log("first connect");
    console.log(newSocket);
    console.log(socket);
    countRef.current = 0;
    console.log(countRef.current);
  }, []);

  useEffect(() => {
    if (isLoad == true) {
      console.log("before websocket connect");
      console.log(socket);
      // socket.onopen = () => {
      console.log("WebSocket connected");
      console.log(message);
      console.log(countRef.current);
      axios
        .get(process.env.REACT_APP_API_ROOT + "getStatus")
        .then((response) => {
          if (response["data"]["status"] == "success" && countRef.current > 2) {
            countRef.current = 0;
            setLoading(false);
            setDisable(false);
            setTableData(response["data"]["result"]);
          } else {
            setExtractedCount(response["data"]["extracted_count"]);
            setTotalCount(response["data"]["total_count"]);
            socket.send(
              JSON.stringify({
                message: "getStatus",
              })
            );
          }
        });
      // };
    }

    countRef.current = countRef.current + 1;
  }, [message]);

  useEffect(() => {
    dispatch(resetPagnation());
    axios.get(process.env.REACT_APP_API_ROOT + "getLog").then((response) => {
      if (response["status"] == "200") {
        setTableData(response["data"]["result"]);
      }
    });
  }, [deleteLogId]);

  const handleClick = () => {
    console.log(socket);
    const store_name = storeElement.current.value;
    if (store_name == "") {
      alert("すべてのフィールドを入力してください");
    } else {
      setLoading(true);
      setDisable(true);
      axios
        .post(
          process.env.REACT_APP_API_ROOT + "getProducts",
          {
            storeName: store_name,
          },
          { timeout: 1000000 }
        )
        .then((response) => {
          if (response["data"]["status"] == "200") {
            setTableData(response["data"]["result"]);
            setLoading(false);
            setDisable(false);
          }
          if (response["data"]["status"] == "300") {
            alert("その店には商品がありません。");
            setLoading(false);
            setDisable(false);
          }
          if (response["data"]["status"] == "500") {
            alert("その店には商品がありません。");
            setLoading(false);
            setDisable(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      // fetch(process.env.REACT_APP_API_ROOT + "getProducts", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ storeName: store_name }),
      // }).catch((error) => {
      //   // Handle any errors that occurred during the fetch
      //   console.error("Request failed", error);
      // });

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessage(data.message);
        // console.log(data.message);

        socket.send(
          JSON.stringify({
            message: "getStatus",
          })
        );
      };

      socket.send(
        JSON.stringify({
          message: "getStatus",
        })
      );
    }
  };

  const handleDeleteLog = (event) => {
    console.log(event.target.id);
    axios
      .post(process.env.REACT_APP_API_ROOT + "deleteLog", {
        logId: event.target.id,
      })
      .then((res) => {
        setDeleteLog(event.target.id);
      });
  };
  let displayTableData = [];
  if (countPerPage * activePage <= tableData.length) {
    displayTableData = tableData.slice(
      countPerPage * (activePage - 1),
      countPerPage * activePage
    );
  } else {
    displayTableData = tableData.slice(
      countPerPage * (activePage - 1),
      tableData.length
    );
  }
  const tableHeaders = ["ID", "店名", "日付時刻 ", "アクション"];

  return (
    <>
      <div class=" mb-3 mt-6">
        <div className="flex flex-wrap justify-center items-center space-x-5">
          <div>店名:</div>
          <div class="relative mb-3 mt-2 flex h-12 sm:w-[20%] md:w-[20%] w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="default-search"
              class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
              placeholder=""
              ref={storeElement}
            />
          </div>
          <div>
            <button
              className=" space-x-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none   shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 "
              onClick={handleClick}
              disabled={disable}
            >
              抽出
            </button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <ExtractingLoader count={extractedCount} totalCount={totalCount} />
      ) : (
        <>
          <ListTable
            tableHeaders={tableHeaders}
            tableData={displayTableData}
            handleDeleteLog={handleDeleteLog}
            // isLoading={isLoading}
          />
          <TableFooter rowCount={tableData.length} />
        </>
      )}
    </>
  );
};

export default Dashboard;
