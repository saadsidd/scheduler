import React from "react";
import classNames from "classnames";

import "components/DayListItem.scss"

export default function DayListItem(props) {
  const dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots
  });

  const formatSpots = function() {
    if (props.spots === 0) return 'no spots';
    if (props.spots === 1) return '1 spot';
    return `${props.spots} spots`;
  }

  return (
    <li className={dayClass} onClick={() => {props.setDay(props.name)}} data-testid="day">
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()} remaining</h3>
    </li>
  );
}