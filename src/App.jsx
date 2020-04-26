import React, { Component } from "react";
import { Row, Col, Table, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AutoComplete from "react-autocomplete-input";
import axios from "axios";
import htmlToImage from "html-to-image";
import download from "downloadjs";
import dateFormat from "dateformat";
import Loader from "react-loader-spinner";
import cities from "./citiesList";
import endpoint from "./serverEndPonit";

import "react-autocomplete-input/dist/bundle.css";
import "./App.css";

const calendarHeading = [
  {
    title: "Roza #",
    dataIndex: "roza",
    key: "roza",
  },
  {
    title: "Date",
    dataIndex: "date_for",
    key: "date_for",
  },
  {
    title: "Sehri",
    dataIndex: "fajr",
    key: "fajr",
  },
  {
    title: "Aftari",
    dataIndex: "maghrib",
    key: "maghrib",
  },
];

class App extends Component {
  state = {
    searchValue: "",
    cities: cities.cities,
    searchLoader: false,
    tableLoader: false,
    timings: [],
    tableTitle: null,
    errorInGettingData: false,
    errorInSearchString: false,
  };
  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleSearch(e);
    }
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.setState({
      tableTitle: this.state.searchValue,
    });
    this.loadData();
  };

  loadData = () => {
    this.setState({
      tableLoader: true,
      searchLoader: true,
      errorInGettingData: false,
      errorInSearchString: false,
      timings: [],
    });

    axios({
      method: "get",
      url: `${endpoint}/getTimings/${this.state.searchValue}`,
    })
      .then((res) => {
        if (res.status === 204) {
          this.setState({
            errorInSearchString: true,
            tableTitle: "",
            tableLoader: false,
            searchLoader: false,
          });
        } else if (res.status === 200) {
          let data = res.data.response.items;
          data.splice(30, data.length);
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            element.roza = i + 1;
            element.date_for = dateFormat(element.date_for, "fullDate");
          }
          this.setState({
            timings: data,
          });
          this.setState({
            tableLoader: false,
            searchLoader: false,
          });
        } else {
          this.setState({
            tableLoader: false,
            searchLoader: false,
            errorInGettingData: true,
          });
        }
      })
      .catch((err) => {
        this.setState({
          tableLoader: false,
          searchLoader: false,
          errorInGettingData: true,
        });
        console.log(err);
      });
  };

  handleExportAsImage = () => {
    // let htmlString = `<table>
    // <tbody>
    // <tr>
    // <td>a;</td>
    // <td>b;</td>
    // <td>b;</td>
    // </tr>
    // <tr>
    // <td>A</td>
    // <td>B</td>
    // <td>C</td>
    // </tr>
    // </tbody>
    // </table>`;
    // var div = document.createElement("DIV");
    // div.innerHTML = htmlString;
    // document.getElementById("calendar").innerHTML=div;
    // console.log(document.getElementById('calendar'));
    // htmlToImage
    //   .toPng(document.getElementById('imageDiv'))
    //   .then(function (dataUrl) {
    //     download(dataUrl, "my-node.png");
    //   });
  };

  displayError = () => {
    if (this.state.errorInGettingData) {
      return <div>Some Problem Occur While Fetching Data!</div>;
    }
    if (this.state.errorInSearchString) {
      return <div>City not found (make sure you didn't misspell)</div>;
    }
  };
  showCalender = () => {};
  render() {
    return (
      <Row>
        <Col span={24}>
          <div className="mainHead">RAMADAN CALENDAR 2020</div>
        </Col>
        <Col span={24} className="searchBarContainer">
          <Row>
            <Col xs={1} sm={2} md={4} lg={6}></Col>
            <Col xs={22} sm={20} md={16} lg={12}>
              <Row>
                <Col span={24} className="searchBarHead">
                  Enter City Name:
                </Col>
                <Col span={24}>
                  <form className="searchBarForm">
                    <AutoComplete
                      offsetY={30}
                      offsetX={0}
                      trigger=""
                      Component="input"
                      className="searchBar"
                      options={this.state.cities}
                      onKeyDown={this._handleKeyDown}
                      onChange={(e) => {
                        this.setState({
                          searchValue: e,
                        });
                      }}
                    />
                    <Button
                      type="primary"
                      className="searchBarButton"
                      onClick={this.handleSearch}
                      size="large"
                      style={{ fontSize: "1.3rem", padding: "0", margin: "0" }}
                    >
                      <SearchOutlined />
                      {/* Search */}
                    </Button>
                  </form>
                </Col>
                <Col span={24} className="">
                  <div className="searchLoader">
                    <Loader
                      type="ThreeDots"
                      color="dodgerblue"
                      height={50}
                      width={100}
                      visible={this.state.searchLoader}
                    />
                    {this.displayError()}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={1} sm={2} md={4} lg={6}></Col>
          </Row>
        </Col>
        <Col span={24} className="calendar">
          <Row>
            <Col xs={1} sm={2} md={4} lg={6}></Col>
            <Col
              xs={22}
              sm={20}
              md={16}
              lg={12}
              // style={{ textAlign: "center" }}
            >
              <div className="tableTitle">{this.state.tableTitle}</div>
              <Table
                id="calendar"
                size="small"
                columns={calendarHeading}
                dataSource={this.state.timings}
                className="calendar"
                bordered={true}
                loading={this.state.tableLoader}
              />
              <Button type="primary" onClick={this.handleExportAsImage}>
                Download Calendar
              </Button>
            </Col>
            <Col xs={1} sm={2} md={4} lg={6}></Col>
          </Row>
        </Col>
        <Col span={24}>
          <div className="footer">By Usama Majid</div>
        </Col>
      </Row>
    );
  }
}

export default App;
