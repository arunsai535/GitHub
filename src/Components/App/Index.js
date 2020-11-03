import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import Amplify, { API } from 'aws-amplify';
import axios from 'axios';
import { Select, DatePicker, Space } from 'antd'
import AntDFDATable from '../AntDFDATable/Index';
import DateRangePicker from 'react-bootstrap-daterangepicker'
import 'bootstrap-daterangepicker/daterangepicker.css';
import Inputmask from 'inputmask'

Amplify.configure(
  {
    API: {
      endpoints: [
        {
          name: "GetFDAModelsFromAurora-API",
          endpoint: "https://4fu5359q77.execute-api.us-east-1.amazonaws.com/Sandbox"                   
        },
        {
          name: "cascadeapi",
          endpoint: "https://lb2vumck3k.execute-api.ap-south-1.amazonaws.com/dev"
        }
      ]
    }
  });


export class Home extends Component {
  Filters = {};
  FDAList = [];
  FilteredList = [];
  selectedModality = "";
  selectedBodyArea = "";
  selectedManufacturer = "";
  selectedProductCode = "";
  selectedClinicallyValidated = "";
  searchText = "";
  startDate = null;
  endDate = null;
  state = {
    FDAList: this.FDAList,
    FilteredList: this.FDAList,
    loading: true,
    Filters: this.Filters,
    modalities: {},
    bodyArea: {},
    manufacturer: {},
    productCode: {},
    clinicallyValidated: {}
  }

  static getDerivedStateFromProps(props, state) {
    return null;
  }
  componentDidMount() {
    this.getFDAData();
  }
  resolveDropdown = (fdalist, selectType) => {
    var returnarr = [];
    var array = [];
    var newArray = [];
    if (selectType === "BodyArea") {
      var bodyData = fdalist.map(x => x["Body Area"])
      newArray = [];
      bodyData.forEach((x, i) => {
        var fdba = x.split(',')
        fdba.forEach((d, i) => {
          newArray.push(d)
        })
      })
      array = [...new Set(newArray)]
    }

    if (selectType === "Manufacturer") {
      array = [...new Set(fdalist.map((x) => x.Company))]
    }

    if (selectType === "Modality") {
      var modality = fdalist.map(x => x["Modality"])
      newArray = [];
      modality.forEach((x, i) => {
        var fdba = x.split(',')
        fdba.forEach((d, i) => {
          newArray.push(d)
        })
      })
      array = [...new Set(newArray)]
    }

    // if (selectType === "ClinicallyValidated") {
    //   array = ["Clinically Validated?", "Yes", "No"]
    // }
    array.forEach((x, i) => {
      var newObj = {};
      newObj["label"] = x
      newObj["value"] = x
      returnarr.push(newObj)
    })
    return returnarr
  }
  handleBAChange = (selectedOption) => {
    this.selectedBodyArea = selectedOption === undefined ? "Body Area" : selectedOption
    this.filterData()
  }
  handleManufacturerChange = (selectedOption) => {
    this.selectedManufacturer = selectedOption === undefined ? "Manufacturer" : selectedOption
    this.filterData()
  }
  hanldeModalityChange = (selectedOption) => {
    this.selectedModality = selectedOption === undefined ? "Modality" : selectedOption
    this.filterData()
  }
  handleSearchTextChange = (evt) => {
    this.searchText = evt.target.value;
    this.filterData()
  }
  handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format('MM/DD/YYYY') +
      ' - ' +
      picker.endDate.format('MM/DD/YYYY')
    );
    this.startDate = picker.startDate.format('MM/DD/YYYY');
    this.endDate = picker.endDate.format('MM/DD/YYYY')
    this.filterData()
  };
  handleCancel = (event, picker) => {
    picker.element.val('');
    this.startDate = null;
    this.endDate = null;
    this.filterData()
    this.applyMasking()
  };
  handleDPChange = (date) => {
    debugger;
    if (date !== null) {
      var sd = new Date(date["0"]._d);
      var startDate = ((sd.getMonth() > 8) ? (sd.getMonth() + 1) : ('0' + (sd.getMonth() + 1))) + '/' + ((sd.getDate() > 9) ? sd.getDate() : ('0' + sd.getDate())) + '/' + sd.getFullYear();
      this.startDate = startDate;
      var ed = new Date(date["1"]._d);
      var endDate = ((ed.getMonth() > 8) ? (ed.getMonth() + 1) : ('0' + (ed.getMonth() + 1))) + '/' + ((ed.getDate() > 9) ? ed.getDate() : ('0' + ed.getDate())) + '/' + ed.getFullYear();
      this.endDate = endDate;
    }
    else {
      this.startDate = this.endDate = date;
    }
    this.filterData()
  }

  handleDateChange = (evt) => {
    var actVal = evt.target.value;
    var val = evt.target.value;
    val = val.replaceAll('/', "").replaceAll("_", "").replaceAll("-", "").replace("  ", "");
    if (val.length == 16) {
      this.startDate = actVal.split('-')[0];
      this.endDate = actVal.split('-')[1];
      this.filterData()
    }
    else {
      this.startDate = null;
      this.endDate = null;
      this.filterData()
    }
  }
  filterData = () => {
    var temptbl = this.state.FDAList;
    if (this.selectedManufacturer !== "Manufacturer") {
      temptbl = temptbl.filter(x => x.Company.includes(this.selectedManufacturer))
    }

    if (this.selectedBodyArea !== "Body Area") {
      temptbl = temptbl.filter((x, i) => {
        return (x["Body Area"].includes(this.selectedBodyArea))
      });
    }

    if (this.selectedModality !== "Modality") {
      temptbl = temptbl.filter(x => x.Modality.includes(this.selectedModality))
    }

    //if (this.selectedClinicallyValidated !== "Clinically Validated?") {
    // temptbl = temptbl.filter(x => x.Modality.includes(this.selectedModality))
    //}

    if (this.searchText !== "") {
      let val = this.searchText.toLowerCase();
      temptbl = temptbl.filter((v, i) => {
        if (v["Company"].toLowerCase().includes(val) ||
          v["Body Area"].toLowerCase().includes(val) ||
          v["Modality"].toLowerCase().includes(val) ||
          v["Product"].toLowerCase().includes(val) ||
          v["DateCleared"].includes(val))
          return v;
      })
    }
    if (this.startDate !== null && this.endDate !== null) {
      temptbl = temptbl.filter((item, index) => {
        if (new Date(item["DateCleared"]) >= new Date(this.startDate) && new Date(item["DateCleared"]) <= new Date(this.endDate))
          return item
      });
    }


    this.setState({ FilteredList: temptbl })
  }

  getFDAData() {
    const apiName = 'GetFDAModelsFromAurora-API';
    const Apiroot = 'https://4fu5359q77.execute-api.us-east-1.amazonaws.com/Sandbox';//use only with axios
    const path = '/GetFDAModelsFromAurora';
    const myInit = {
      headers: {},
      response: true,
    };

    // API
    //   .get(apiName, path, myInit)
    //   .then(response => {
    //     console.log(response);
    //     var fdadata = Object.values(JSON.parse(response.data.FDAData));
    //     var tempObj = [];
    //     fdadata.forEach((x, i) => {
    //       x["DateCleared"] = x["Date Cleared"].split('-')[1] + "/" + x["Date Cleared"].split('-')[2] + "/" + x["Date Cleared"].split('-')[0]
    //       tempObj.push(x);
    //     })
    //     this.FDAList = tempObj;
    //     this.Filters.BodyArea = this.resolveDropdown(this.FDAList, "BodyArea");
    //     this.Filters.ClinicallyValidated = this.resolveDropdown("", "ClinicallyValidated");
    //     this.Filters.Manufacturer = this.resolveDropdown(this.FDAList, "Manufacturer");
    //     this.Filters.Modality = this.resolveDropdown(this.FDAList, "Modality");
    //     this.Filters.ProductCode = JSON.parse(response.data.ProductCode);
    //     this.setState({
    //       FDAList: this.FDAList,
    //       loading: false,
    //       Filters: this.Filters,
    //       modalities: this.Filters.Modality,
    //       bodyArea: this.Filters.BodyArea,
    //       manufacturer: this.Filters.Manufacturer,
    //       productCode: this.Filters.ProductCode,
    //       clinicallyValidated: this.Filters.ClinicallyValidated,
    //       FilteredList: this.FDAList
    //     }, () => { console.log('component-did-mount', this.state.FDAList) });
    //     this.applyMasking()

    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

      axios.get(Apiroot+path)
      .then(response => {
        console.log(response);
        var fdadata = Object.values(JSON.parse(response.data.FDAData));
        var tempObj = [];
        fdadata.forEach((x, i) => {
          x["DateCleared"] = x["Date Cleared"].split('-')[1] + "/" + x["Date Cleared"].split('-')[2] + "/" + x["Date Cleared"].split('-')[0]
          tempObj.push(x);
        })
        this.FDAList = tempObj;
        this.Filters.BodyArea = this.resolveDropdown(this.FDAList, "BodyArea");
        this.Filters.ClinicallyValidated = this.resolveDropdown("", "ClinicallyValidated");
        this.Filters.Manufacturer = this.resolveDropdown(this.FDAList, "Manufacturer");
        this.Filters.Modality = this.resolveDropdown(this.FDAList, "Modality");
        // this.Filters.ProductCode = JSON.parse(response.data.ProductCode);
        this.setState({
          FDAList: this.FDAList,
          loading: false,
          Filters: this.Filters,
          modalities: this.Filters.Modality,
          bodyArea: this.Filters.BodyArea,
          manufacturer: this.Filters.Manufacturer,
          productCode: this.Filters.ProductCode,
          clinicallyValidated: this.Filters.ClinicallyValidated,
          FilteredList: this.FDAList
        }, () => { console.log('component-did-mount', this.state.FDAList) });
        this.applyMasking()
      })
  }
  applyMasking = () => {
    var selector = document.getElementById("datecleared");
    var im = new Inputmask("99/99/9999 - 99/99/9999");
    im.mask(selector);
  }
  render() {
    return (
      <div>
        <div className="app-content content">
          <div className="content-wrapper">
            <div className="content-header row">
              <div className="content-header-left col-md-6 col-12 mb-2">
                <h3 className="content-header-title mb-0">FDA Cleared AI Algorithms</h3>
              </div>
            </div>
            <div className="content-body">
              <section id="scroll">
                <div className="row">
                  <div className="col-12">
                    <div className="card card-normal">

                      <div className="card-content">

                        <p className="card-text">
                          Our list of FDA cleared AI algorithms provides valuable details on each
                          model, bringing all of the relevant information together for easy access.
                          Convenient summaries for
                          each algorithm include model manufacturer, FDA product code, body area,
                          modality, predicate devices, product testing and evaluation related to
                          product performance,
                          and clinical validation. Our Define-AI use cases match many of the models
                          and those are listed under Related Use Cases. For other details, clicking on
                          the model will take
                          you directly to the FDA summary.
                                        </p>
                        <p className="card-text">
                          Check back regularly to see which new algorithms are available and have been
                          added to the list. Send information on AI algorithms that are not listed and
                          report missing
                          information to DSI@acr.org.
                                        </p>

                      </div>
                    </div>
                  </div>
                </div>
                {this.state.loading ? " " :
                  <div className="row">
                    <div className="col-xl-2 col-lg-4 col-md-12">
                      <fieldset className="form-group position-relative">
                        <input type="text" className="form-control" placeholder="Search" name="SearchText" onChange={this.handleSearchTextChange} />
                        <div className="form-control-position">
                          <i className="ft-search"></i>
                        </div>
                      </fieldset>
                    </div>
                    <div className="col-xl-2 col-lg-4 col-md-12">
                      <fieldset className="form-group">
                        <Select
                          style={{ width: "100%" }}
                          onChange={this.handleManufacturerChange}
                          placeholder="Company"
                          size="large"
                          showSearch
                          dropdownMatchSelectWidth={false}
                          allowClear={true}
                          onClear={this.handleManufacturerChange}
                        >
                          {this.state.Filters.Manufacturer.map(item => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.value}
                            </Select.Option>
                          ))}
                        </Select>
                      </fieldset>
                    </div>
                    <div className="col-xl-2 col-lg-4 col-md-12">
                      <fieldset className="form-group">
                        <Select
                          style={{ width: "100%" }}
                          onChange={this.handleBAChange}
                          placeholder="Body Area"
                          size="large"
                          showSearch
                          dropdownMatchSelectWidth={false}
                          allowClear={true}
                          onClear={this.handleBAChange}
                        >
                          {this.state.Filters.BodyArea.map(item => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.value}
                            </Select.Option>
                          ))}
                        </Select>
                      </fieldset>
                    </div>
                    <div className="col-xl-2 col-lg-4 col-md-12">
                      <fieldset className="form-group">
                        <Select
                          style={{ width: "100%" }}
                          onChange={this.hanldeModalityChange}
                          placeholder="Modality"
                          size="large"
                          showSearch
                          dropdownMatchSelectWidth={false}
                          allowClear={true}
                          onClear={this.hanldeModalityChange}
                        >
                          {this.state.Filters.Modality.map(item => (
                            <Select.Option key={item.value} value={item.value}>
                              {item.value}
                            </Select.Option>
                          ))}
                        </Select>
                      </fieldset>
                    </div>
                    {/* <div className="col-xl-2 col-lg-4 col-md-12">
                            <fieldset className="form-group">
                              <Select
                                style={{ width: "100%" }}
                                defaultValue="Clinically Validated?"
                                onChange={this.hanldeCValidatedChange}
                                placeholder="Clinically Validated?"
                                size="large"
                                showSearch
                                dropdownMatchSelectWidth={false}
                              >
                                {this.state.Filters.ClinicallyValidated.map(item => (
                                  <Select.Option key={item.value} value={item.value}>
                                    {item.value}
                                  </Select.Option>
                                ))}
                              </Select>
                            </fieldset>

                          </div> */}
                    <div className="col-lg-4 col-xl-2 col-md-12">
                      <fieldset className="form-group">
                        {/* <Space direction="vertical" size={12}>
                              <RangePicker
                                format={dateFormat}
                                allowClear={true}
                                size="large"
                                separator="|"
                                defaultValue={[this.state.startDate, this.state.endDate]}
                                onChange={this.handleDPChange}
                                placeholder={["Start date","End date"]}  
                                style={{width:"350px"}}                             
                              />
                              </Space> */}
                        <DateRangePicker
                          onApply={this.handleApply}
                          onCancel={this.handleCancel}

                          initialSettings={{
                            showDropdowns: true,
                            autoUpdateInput: false,
                            parse: false,
                            locale: {
                              cancelLabel: 'Clear',
                            },

                          }}
                        >
                          <input type="text" id="datecleared" className="form-control" defaultValue="" maxLength="23" placeholder="Date Cleared" onChange={this.handleDateChange} />
                        </DateRangePicker>
                      </fieldset>
                    </div>
                  </div>
                }
                {this.state.loading ? " " :
                  <AntDFDATable FDAList={this.state.FilteredList} Filters={this.Filters} SearchText={this.searchText} />
                }
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

