import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="space-y-6">
      {Object.keys(filterOptions).map((keyItem) => (
        <Fragment key={keyItem}>
          <div>
            <h3 className="text-base font-bold text-gray-800 mb-3 capitalize">{keyItem}</h3>
            <div className="space-y-2">
              {filterOptions[keyItem].map((option) => (
                <Label 
                  key={option.id} 
                  className="flex font-medium items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={
                      filters &&
                      Object.keys(filters).length > 0 &&
                      filters[keyItem] &&
                      filters[keyItem].indexOf(option.id) > -1
                    }
                    onCheckedChange={() => handleFilter(keyItem, option.id)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </Label>
              ))}
            </div>
          </div>
          <Separator className="bg-gray-200" />
        </Fragment>
      ))}
    </div>
  );
}

export default ProductFilter;
