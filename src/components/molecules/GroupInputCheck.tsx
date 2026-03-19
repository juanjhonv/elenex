import React, { useState } from "react";
import InputCheck from "../atoms/InputCheck";
import type { GroupInputCheckCallbackProps, GroupInputCheckParams } from "./types";

export default function GroupInputCheck({ info, filters, setFilters }: GroupInputCheckParams) {
  const [active, setActive] = useState(true);

  const callback = ({ fieldname, idfield }: GroupInputCheckCallbackProps) => {
    let filtername = info.filterfield;
    let categoryIDs: string[] | [];

    if (filters) {
      if (typeof filters.category_id === 'string') {
        setFilters({ ...filters, [filtername]: idfield });
      } else if (Array.isArray(filters.category_id)) {
        const currentIDs = filters.category_id as string[];
        categoryIDs = currentIDs.includes(idfield)
          ? currentIDs.filter(idcat => idcat !== idfield)
          : [...currentIDs, idfield];
        setFilters({ ...filters, [filtername]: categoryIDs });
      } else {
        setFilters({ ...filters, [filtername]: [idfield] });
      }
    } else {
      setFilters({})
    }
  };

  if (info) {
    return (
      <div className="border">
        <div className="flex justify-between">
          <span>Rubros</span>
          <span className="cursor-pointer" onClick={() => setActive(!active)}>
            {
              active
                ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-up"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 15l6 -6l6 6" /></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 9l6 6l6 -6" /></svg>
            }
          </span>
        </div>
        <ul className={`${!active ? 'hidden' : ''}`}>
          {
            info.filtervalues.map(data => <li><InputCheck info={data} filters={filters} callback={callback} /></li>)
          }
        </ul>
      </div>
    )
  } else {
    return (<></>)
  }
}


