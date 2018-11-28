import React from "react";
import cx from "classnames";

import { FormattedNumber } from "react-intl";

import styles from "./currency.css";
import globalStyles from "../../../css/global.css";

export default ({ className, value }) => (
  <FormattedNumber
    className={className}
    value={value || 0}
    style="currency"
    currency={"EUR"}
    currencyDisplay={"symbol"}
    minimumFractionDigits={2}
    maximumFractionDigits={2}
  />
);
