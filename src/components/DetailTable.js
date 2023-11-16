import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { resetPagnation, setProcessing } from "../pages/listingSlice";
import Loader from "./Loader";
import ListingLoader from "./ListingLoader";
import EditModal from "./EditModal";
import AllEditModal from "./AllEditModal";
import { useState } from "react";
import {
  setCheckboxBestOffer,
  setCheckboxBestOfferRemove,
} from "../pages/editSlice";

const DetailTable = ({
  tableHeaders,
  tableData,
  allTableData,
  isLoading,
  handleCheckBox,
  handleClickBestOfferAll,
  handleClickListingExceptAll,
  listed_count,
}) => {
  const currentPage = useSelector((state) => state.listing.activePage);
  const countPerPage = useSelector((state) => state.listing.countPerPage);
  const checkboxbestoffer = useSelector(
    (state) => state.edit.checkboxbestoffer
  );
  const checkboxlist = useSelector((state) => state.edit.checkboxlist);
  const dispatch = useDispatch();
  const [isChecked, setChecked] = useState();

  const handleCheckBoxBestOffer = (event) => {
    if (!checkboxbestoffer.includes(event.target.id)) {
      dispatch(setCheckboxBestOffer(event.target.id));
    } else {
      dispatch(setCheckboxBestOfferRemove(event.target.id));
    }
  };

  const handlePicture = (picture_urls) => {
    const converted_picture = JSON.parse(picture_urls);
    return <img className="w-[100px] h-[100px]" src={converted_picture[0]} />;
  };
  return (
    <div class="mx-10">
      <div class="flex flex-wrap -mx-4">
        <div class="w-full px-4">
          <div class="max-w-full overflow-x-auto">
            {isLoading ? (
              <ListingLoader count={listed_count} />
            ) : (
              <table class="table-auto w-full">
                <thead>
                  <tr class=" bg-blue-600 text-center">
                    <th
                      class="
                           w-[2%]
                           h-[16px]
                          
                           text-[13px]
                           font-base
                           text-white
                           py-2
                           lg:py-3
                           px-2
                           lg:px-3
                           border-l border-transparent
                           "
                    >
                      ID
                    </th>
                    <th
                      class="
                         w-[2%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                       
                      
                      
                     
                         border-l border-transparent
                         "
                    >
                      <button
                        onClick={handleClickListingExceptAll}
                        className="border border-white px-1 py-1"
                      >
                        出品除外
                      </button>
                    </th>
                    <th
                      class="
                         w-[2%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                       
                         border-l border-transparent
                         "
                    >
                      <button
                        onClick={handleClickBestOfferAll}
                        className="border border-white px-1 py-1"
                      >
                        Best Offer
                      </button>
                    </th>
                    <th
                      class="
                         w-[5%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                       
                         border-l border-transparent
                         "
                    >
                      画像
                    </th>

                    {tableHeaders.map((header, key) => {
                      return (
                        <th
                          key={key}
                          class="
                           w-[20%]
                           h-[16px]
                           min-w-[160px]
                           text-[13px]
                           font-base
                           text-white
                           py-2
                           lg:py-3
                           px-2
                           lg:px-3
                           border-l border-transparent
                           "
                        >
                          {header}
                        </th>
                      );
                    })}
                    <th
                      class="
                         w-[5%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                         py-2
                         lg:py-3
                         px-2
                         lg:px-3
                         border-l border-transparent
                         "
                    >
                      価格
                    </th>
                    <th
                      class="
                         w-[5%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                         py-2
                         lg:py-3
                         px-2
                         lg:px-3
                         border-l border-transparent
                         "
                    >
                      SKU
                    </th>
                    <th
                      class="
                         w-[5%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                         py-2
                         lg:py-3
                         px-2
                         lg:px-3
                         border-l border-transparent
                         "
                    >
                      送料
                    </th>
                    <th
                      class="
                         w-[5%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                         py-2
                         lg:py-3
                         px-2
                         lg:px-3
                         border-l border-transparent
                         "
                    >
                      　　商品　URL
                    </th>
                    <th
                      class="
                         w-[5%]
                         h-[16px]
                       
                         text-[13px]
                         font-base
                         text-white
                         py-2
                         lg:py-3
                         px-2
                         lg:px-3
                         border-l border-transparent
                         "
                    >
                      <AllEditModal data={allTableData} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((item, i) => {
                    return (
                      <tr key={item.id}>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          {countPerPage * (currentPage - 1) + i + 1}
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           bg-white
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          <input
                            type="checkbox"
                            id={item.id}
                            // key={item.id}
                            checked={
                              checkboxlist.includes(String(item.id))
                                ? true
                                : false
                            }
                            className="h-[16px] w-[16px]"
                            onChange={handleCheckBox}
                          />
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           bg-white
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          <input
                            type="checkbox"
                            id={item.id}
                            // key={item.id}
                            checked={
                              checkboxbestoffer.includes(String(item.id))
                                ? true
                                : false
                            }
                            className="h-[16px] w-[16px]"
                            onChange={handleCheckBoxBestOffer}
                          />
                        </td>
                        <td
                          class="
                          flex
                          justify-center
                          items-center
                           text-center text-dark
                           text-base
                           py-2
                          
                           bg-white
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          {handlePicture(item.picture_urls)}
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           bg-white
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          {item.title}
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          {item.price}
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          {item.sku}
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          {item.shipping_cost}
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           border-b border-l border-[#E8E8E8]
                           "
                        >
                          <a href={`https://www.ebay.com/itm/` + item.item_id}>
                            {`https://www.ebay.com/itm/` + item.item_id}
                          </a>
                        </td>
                        <td
                          class="
                           text-center text-dark
                           text-base
                           py-5
                           px-2
                           bg-white
                           border border-[#E8E8E8]
                           "
                        >
                          <EditModal item={item} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTable;
