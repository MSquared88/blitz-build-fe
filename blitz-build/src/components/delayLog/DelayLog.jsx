import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { ExportToCsv } from "export-to-csv";
import Global from "../../styles/Global";
import DelayLogContext from "../../contexts/delayLog/DelayLogContext";
import DelayLogButton from "./DelayLogButton";
import searchTermContext from "../../contexts/searching/searchTerm";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
// pages bar function from global
import TablePaginationActions from "../global/TablePaginationActions";

const StyledTableCell = withStyles(theme => ({
  head: {
    padding: "8px 32px",
    height: 35,
    backgroundColor: "#E9E9E9",
    color: theme.palette.common.black
  },
  body: {
    padding: "8px 32px",
    fontSize: 16,
    height: 104
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(even)": {
      background: "#F5F5F5"
    },
    marginBottom: "32px"
  }
}))(TableRow);



const useStyles = makeStyles({
  root: {
    border: "1px solid #DCD9D5"
  },
  table: {
    minWidth: "1080px"
  },
  tableHover: {
    "&:hover": {
      border: "3px solid orange"
    }
  }
});

function DelayLog() {
  const { delayLogs } = useContext(DelayLogContext);
  const classes = useStyles();
  const { searchTerm } = useContext(searchTermContext);
  const delayLogSearchInput = searchTerm.toLowerCase("");
const [page, setPage] = React.useState(0);
const [rowsPerPage, setRowsPerPage] = React.useState(5);

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = event => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};
  //console.log(delayLogs)
  //return all delayLogs or filtered delayLogs
  const results = delayLogs.filter(
    delayLog =>
      delayLog.task_name.toLowerCase().includes(delayLogSearchInput) ||
      delayLog.reason.toLowerCase().includes(delayLogSearchInput)
  );
  

  function handleExportCSV() {
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      showTitle: true,
      title: "Delay_Log CSV",
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(results);
  }


const emptyRows =
  rowsPerPage - Math.min(rowsPerPage, results.length - page * rowsPerPage);
  
  console.log("rows in delayLogs table", results);
  return (
    <div>
      <Global />
      <div>
        <DelayLogButtons onClick={handleExportCSV}>
          Export to CSV
        </DelayLogButtons>
      </div>
      <p style={{ color: "#817974", paddingBottom: "8px" }}>
        {" "}
        Your Delay_Logs List{" "}
      </p>
      <Paper className={classes.root}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>TASK NAME</StyledTableCell>
              <StyledTableCell>REASON</StyledTableCell>
              <StyledTableCell>CREATED</StyledTableCell>
              <StyledTableCell>UPDATED</StyledTableCell>
              <StyledTableCell>{"    "}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? results.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : results
            ).map(result => (
              <StyledTableRow key={result.id}>

                <StyledTableCell style={{ maxWidth: 150 }}>

               
                  {result.task_name}
                </StyledTableCell>
                <StyledTableCell style={{ maxWidth: 300 }}>
                  {result.reason}
                </StyledTableCell>
                <StyledTableCell style={{ maxWidth: 150 }}>
                  {result.createdAt}
                </StyledTableCell>
                <StyledTableCell style={{ maxWidth: 150 }}>
                  {result.updatedAt}
                </StyledTableCell>
                <StyledTableCell style={{ maxWidth: 150 }}>
                  {<DelayLogButton delayLog={result} />}
                </StyledTableCell>
              </StyledTableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={results.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: false
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    </div>
  );
}

export default DelayLog;


const DelayLogButtons = styled.div`
  position: absolute;
  width: 174px;
  height: 48px;
  right: 32px;
  top: 24px;
  border: 1px solid;
  box-sizing: border-box;
  border-radius: 3px;
  padding-top:8px;
  padding-left: 30px;
  font-size: 19px;
  color: #8a827d;
  cursor: pointer;
  &:hover {
    color: #dd6b20;
  }
`;

