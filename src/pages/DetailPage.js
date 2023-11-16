import DetailTable from "../components/DetailTable";
import TableFooter from "../components/TableFooter";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { changeCountPerPage } from "./listingSlice";
import {
  setCheckboxList,
  setCheckboxListRemove,
  setBestOfferAll,
  setListingExceptAll,
  setBestOfferAllFlag,
  setListingExceptAllFlag,
} from "./editSlice";

const DetailPage = () => {
  const baseURL = process.env.REACT_APP_API_ROOT + "getDetail";
  const tableHeaders = ["タイトル"];
  let temp_checkboxlist = [];

  const [sellerPolicy, setSellerPolicy] = useState([]);
  const [description, setDescription] = useState([]);
  const [optionTexts, setOptionText] = useState({});
  const [tableData, setTableData] = useState([]);
  const [descriptionOption, setDescriptionOption] = useState();
  const [accountOption, setAccountOption] = useState(
    "v^1.1#i^1#f^0#r^1#p^3#I^3#t^Ul4xMF8yOjY5MEM4MUNBOTc4NDlGNDQ0RTZGMDk2MjNCMEU3NjVBXzNfMSNFXjI2MA=="
  );

  const [isLoading, setLoading] = useState();
  const [disable, setDisable] = useState(false);
  const [listed_count, setListedCount] = useState(0);
  const profitElement = useRef();
  const storeElement = useRef();

  const bestOfferList = [];
  const listingExceptAllList = [];

  const countPerPage = useSelector((state) => state.listing.countPerPage);
  const activePage = useSelector((state) => state.listing.activePage);
  const editStatus = useSelector((state) => state.edit.status);
  const checkboxlist = useSelector((state) => state.edit.checkboxlist);
  const bestOfferAllFlag = useSelector((state) => state.edit.bestOfferAllFlag);
  const listingExceptAllFlag = useSelector(
    (state) => state.edit.listingExceptAllFlag
  );
  const checkboxbestoffer = useSelector(
    (state) => state.edit.checkboxbestoffer
  );

  const dispatch = useDispatch();
  let { id } = useParams();

  useEffect(() => {
    setLoading(true);
    dispatch(changeCountPerPage(200));

    axios
      .post(baseURL, {
        listing_id: id,
      })
      .then((response) => {
        console.log(response["data"]["result"]);
        let result = response["data"]["result"];
        setTableData(result);
        setLoading(false);
      });
  }, [editStatus]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_ROOT + "getDescription")
      .then((response) => {
        if (response["status"] == "200") {
          console.log(response["data"]);
          setDescription(response["data"]["result"]);
          if (response["data"]["result"][0]) {
            setDescriptionOption(response["data"]["result"][0]["description"]);
          }
        }
      });

    axios
      .post(process.env.REACT_APP_API_ROOT + "getSellerProfile", {
        token: accountOption,
      })
      .then((response) => {
        if (response["status"] == "200") {
          setSellerPolicy(response["data"]);
          setOptionText({
            payment: response["data"]["paymentlist"][0],
            shipping: response["data"]["shippinglist"][0],
            return: response["data"]["returnlist"][0],
          });
          console.log(response["data"]);
        }
      });
  }, [accountOption]);

  const handleOptions = (key) => {
    if (sellerPolicy[key] != undefined) {
      let optionlist = [];
      sellerPolicy[key].map((payment) => {
        optionlist.push(
          <option value={payment["profileId"]}>{payment["profileName"]}</option>
        );
      });
      return optionlist;
    }
  };
  const handleDescriptionOptions = () => {
    if (description != undefined) {
      let optionlist = [];
      description.map((item) => {
        optionlist.push(
          <option value={item["description"]}>{item["title"]}</option>
        );
      });
      return optionlist;
    }
  };

  const handleChangeDescription = (event) => {
    console.log(event.target.value);
    setDescriptionOption(event.target.value);
  };

  const handleChangeAccount = (event) => {
    console.log(event.target.value);
    setAccountOption(event.target.value);
  };

  const handleSellerPolicyChange = (event) => {
    let index = event.nativeEvent.target.selectedIndex;
    let text = event.nativeEvent.target[index].text;
    let value = event.nativeEvent.target[index].value;
    setOptionText((values) => ({
      ...values,
      [event.target.id]: { profileId: value, profileName: text },
    }));
  };

  const sortedTableData = tableData.sort((a, b) => a.price - b.price);
  let displayTableData = [];
  if (countPerPage * activePage <= sortedTableData.length) {
    displayTableData = sortedTableData.slice(
      countPerPage * (activePage - 1),
      countPerPage * activePage
    );
  } else {
    displayTableData = sortedTableData.slice(
      countPerPage * (activePage - 1),
      sortedTableData.length
    );
  }

  const handleClickListingExceptAll = () => {
    tableData.map((item) => {
      listingExceptAllList.push(String(item.id));
    });
    dispatch(setListingExceptAll(listingExceptAllList));
    dispatch(setListingExceptAllFlag(!listingExceptAllFlag));
  };
  const handleClickBestOfferAll = () => {
    tableData.map((item) => {
      bestOfferList.push(String(item.id));
    });
    dispatch(setBestOfferAll(bestOfferList));
    dispatch(setBestOfferAllFlag(!bestOfferAllFlag));
  };

  const handleCheckBox = (event) => {
    console.log(checkboxlist.includes(event.target.id));
    if (!checkboxlist.includes(event.target.id)) {
      dispatch(setCheckboxList(event.target.id));
    } else {
      dispatch(setCheckboxListRemove(event.target.id));
    }
  };

  const handlelist = () => {
    console.log(checkboxlist);
    console.log(checkboxbestoffer);
    console.log(
      optionTexts,
      descriptionOption,
      profitElement.current.value,
      accountOption
    );
    const profit_rate = profitElement.current.value;
    if (profit_rate == "" || descriptionOption == undefined) {
      alert("すべてのフィールドを入力してください");
    } else {
      setLoading(true);
      setDisable(true);
      axios
        .post(process.env.REACT_APP_API_ROOT + "listProduct", {
          logId: id,
          businessPolicy: optionTexts,
          description: descriptionOption,
          account: accountOption,
          profitRate: profit_rate,
          checkboxList: checkboxlist,
          checkboxbestoffer: checkboxbestoffer,
        })
        .then((response) => {
          setLoading(false);
          setDisable(false);
          setListedCount(0);
        });

      const interval = setInterval(() => {
        axios
          .get(process.env.REACT_APP_API_ROOT + "getListStatus")
          .then((response) => {
            if (response["data"]["status"] == "success") {
              setLoading(false);
              setDisable(false);
              clearInterval(interval);
            } else {
              setListedCount(response["data"]["list_cn"]);
            }
          });
      }, 2000);
    }
  };
  return (
    <>
      <div className="flex mt-10 mx-10">
        <div className="flex flex-wrap  justify-center items-end  space-x-1 mb-6">
          <div class>
            <label
              for="payment"
              className=" w-1/3  mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              支払いポリシー:
            </label>
            <select
              id="payment"
              className="sm:w-1/3 min-w-max w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleSellerPolicyChange}
            >
              {handleOptions("paymentlist")}
            </select>
          </div>
          <div>
            <label
              for="shipping"
              className=" w-1/3  mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              配送ポリシー:
            </label>
            <select
              id="shipping"
              className="sm:w-1/3 min-w-max w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleSellerPolicyChange}
            >
              {handleOptions("shippinglist")}
            </select>
          </div>
          <div>
            <label
              for="return"
              className=" w-1/3  mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              返品ポリシー:
            </label>
            <select
              id="return"
              className="sm:w-1/3 min-w-max w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleSellerPolicyChange}
            >
              {handleOptions("returnlist")}
            </select>
          </div>
          <div>
            <label
              for="description"
              className=" w-1/3  mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              説明文:
            </label>
            <select
              id="description"
              className="sm:w-1/3 min-w-max w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleChangeDescription}
            >
              {handleDescriptionOptions()}
            </select>
          </div>
          <div>
            <label
              for="description"
              className=" w-1/3  mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              アカウント:
            </label>
            <select
              id="description"
              className="sm:w-1/3 min-w-max w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleChangeAccount}
            >
              <option value="v^1.1#i^1#f^0#r^1#p^3#I^3#t^Ul4xMF8yOjY5MEM4MUNBOTc4NDlGNDQ0RTZGMDk2MjNCMEU3NjVBXzNfMSNFXjI2MA==">
                heihachi2017
              </option>
              <option value="v^1.1#i^1#f^0#r^1#I^3#p^3#t^Ul4xMF8wOjQxMTFDRDZCN0JENTcwRUFDMDU3RjdCNkQzQTdDNjk2XzNfMSNFXjI2MA==">
                world-style
              </option>
              <option value="v^1.1#i^1#r^1#f^0#p^3#I^3#t^Ul4xMF85OkUxM0UxNjU2MjU1OTcwRDRDRDE1RDQ5RDU3MTM5OTdDXzNfMSNFXjI2MA==">
                dolph2014
              </option>
            </select>
          </div>
          <div>
            <label
              for="profit_rate"
              className=" w-1/3  mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              利益率:
            </label>
            <input
              type="text"
              id="profit_rate"
              className="sm:w-1/3 min-w-max w-1/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder=""
              defaultValue="1.0"
              ref={profitElement}
            />
          </div>
          <div>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:outline-none   shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
              onClick={handlelist}
            >
              <span>出品</span>
            </button>
          </div>
        </div>
      </div>

      <DetailTable
        tableHeaders={tableHeaders}
        tableData={displayTableData}
        allTableData={sortedTableData}
        isLoading={isLoading}
        handleCheckBox={handleCheckBox}
        handleClickBestOfferAll={handleClickBestOfferAll}
        handleClickListingExceptAll={handleClickListingExceptAll}
        listed_count={listed_count}
      />
      <TableFooter rowCount={tableData.length} />
    </>
  );
};

export default DetailPage;
