import React, { Component } from 'react';
import Amplify, { API } from 'aws-amplify';
import axios from 'axios';
import { Modal, } from 'antd';//Button
import Draggable from 'react-draggable';
import moment from 'moment';

Amplify.configure(
    {
        API: {
            endpoints: [
                {
                    name: "cascadeapi",
                    endpoint: "https://lb2vumck3k.execute-api.ap-south-1.amazonaws.com/dev"
                }
            ]
        }
    });


export class ProductDetails extends Component {
    state = {
        visible: false,
        disabled: true,
        loading: true,
        selectedProductCode: {}
    };
    Product = {};

    componentDidMount() {
        this.getProductDetails()
    }

    showModal = (e, p) => {
        this.setState({
            visible: true,
            selectedProductCode: p
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    getProductDetails() {
        const apiName = 'cascadeapi';
        const Apiroot = 'https://4fu5359q77.execute-api.us-east-1.amazonaws.com/Sandbox';//use only with axios
        const path = '/GetFDAProductDetailsFromAurora';
        const myInit = {
            headers: {},
            response: true,
            queryStringParameters: {
                pid: this.props.match.params.Id,
            },
        };
        // Begin Uncomment while using amplify API//
        // API
        //     .get(apiName, path, myInit)
        //     .then(response => {
        //         // console.log(response.data.body);
        //         this.Product = JSON.parse(response.data.body);
        //         this.setState({ loading: false })
        //     });
        //End Uncomment while using amplify API //
        const params = new URLSearchParams([['pid', this.props.match.params.Id]]);

        this.Product.PreviousVersions = [];
        axios.get(Apiroot + path, { params })
            .then(response => {
                var resProduct = Object.values(JSON.parse(response.data.Product));
                const flags = new Set();
                this.Product.ProductCodes = resProduct.map(x => ({ ProductCode: x.ProductCode, Device: x.Device, Definition: x.Definition }))
                    .filter(entry => {
                        if (flags.has(entry.ProductCode)) {
                            return false;
                        }
                        flags.add(entry.ProductCode);
                        return true;
                    });
                this.Product.PID = resProduct[0].PID;
                this.Product.Product = resProduct[0].Product;
                this.Product.Company = resProduct[0].Company;
                this.Product.CompanyLink = resProduct[0].CompanyLink;
                this.Product.IndicationsofUse = resProduct[0].IndicationsofUse;
                this.Product.ProductPerformance = resProduct[0].ProductPerformance;
                this.Product.ClinicalValidation = resProduct[0].ClinicalValidation;
                this.Product.ReleatedUseCase = resProduct[0].ReleatedUseCase;
                this.Product.FDALink = resProduct[0].FDALink;
                this.Product.DateCleared = resProduct[0].DateCleared;
                this.Product.PreviousVersion = [...new Set(resProduct.map(x => x.PreviousVersion))].join(' , ');
                this.Product.PredicateDevice = [...new Set(resProduct.map(x => x.PredicateDevice))].join(' , ');
                this.Product.BodyArea = [...new Set(resProduct.map(x => x.BodyArea))].join(' , ');
                this.Product.Modality = [...new Set(resProduct.map(x => x.Modality))].join(' , ');
                this.setState({ loading: false });

            })
    }
    render() {
        console.log(this.Product);
        return (
            <>
                {this.state.loading ? " " :
                    <div className="app-content content">
                        <div className="content-wrapper">
                            <div className="content-header row">
                                <div className="content-header-left col-md-6 col-12 mb-2 mx-auto text-center">
                                    <h3 className="content-header-title content-header-title2 mb-0">{this.Product["Product"]}</h3>
                                </div>
                            </div>
                            <div className="content-body">
                                <div className="card card-normal">
                                    <div className="card-content">
                                        <div className="row justify-content-start">
                                            <div className="col-md-5 offset-md-2 col-12 mb-2">
                                                <table className="table table-borderless table-sm table-0">
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-color text-bold-700">Company</td>
                                                            <td><a href={this.Product["CompanyLink"]} target="_black">{this.Product["Company"]}</a></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-color text-bold-700">Product Code</td>
                                                            <td>{this.Product["ProductCodes"].map((p, index) => {
                                                                if (index == 0)
                                                                    return <span key={index}>{p["ProductCode"]}<i className="ml-1 fa fa-info-circle" onClick={(e) => this.showModal(e, p)} ></i></span>
                                                                else
                                                                    return <span key={index}>, {p["ProductCode"]}<i className="ml-1 fa fa-info-circle" onClick={(e) => this.showModal(e, p)} ></i></span>
                                                            })}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-color text-bold-700">FDA Cleared Date</td>
                                                            <td>{moment(this.Product["DateCleared"]).format("MM/DD/YYYY")}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-color text-bold-700">Predicate Device(s)</td>
                                                            <td>{this.Product.PredicateDevice}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-color text-bold-700">Previous Version(s)</td>
                                                            <td>{this.Product.PreviousVersion}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-color text-bold-700">Body Area</td>
                                                            <td>{this.Product.BodyArea}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-color text-bold-700">Modality</td>
                                                            <td>{this.Product.Modality}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-8 col-12 mb-2 mx-auto">
                                                <h4 className="text-color text-bold-700">Indications for Use</h4>
                                                <p className="card-text">
                                                    {this.Product.IndicationsofUse}
                                                </p>
                                                <h4 className="text-color text-bold-700">Product Performance</h4>
                                                <p className="card-text">
                                                    {this.Product.ProductPerformance}
                                                </p>
                                                <h4 className="text-color text-bold-700">Clinical Validation</h4>
                                                <p className="card-text">
                                                    {this.Product.ClinicalValidation}
                                                </p>
                                                <h4 className="text-color text-bold-700">Related Use Cases</h4>
                                                <p className="card-text">
                                                    {this.Product.ReleatedUseCase}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-8 col-12 mb-2 mx-auto">
                                                <div className="d-flex justify-content-end">
                                                    <a href={this.Product.FDALink} target="_blank" className="pdf-link">
                                                        <i className="pdf-icon"></i>
                                                        <span>View FDA Summary</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                <Modal
                    title={
                        <div
                            style={{
                                width: '100%',
                                cursor: 'move',
                            }}
                            onMouseOver={() => {
                                if (this.state.disabled) {
                                    this.setState({
                                        disabled: false,
                                    });
                                }
                            }}
                            onMouseOut={() => {
                                this.setState({
                                    disabled: true,
                                });
                            }}
                            // fix eslintjsx-a11y/mouse-events-have-key-events
                            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                            onFocus={() => { }}
                            onBlur={() => { }}
                        // end
                        >
                            Product Code Details
                        </div>
                    }
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    modalRender={modal => <Draggable disabled={this.state.disabled}>{modal}</Draggable>}
                >
                    <div className="app-content content">
                        <div className="content-header row">
                            <div className="content-header-left col-md-12 col-12 mb-2 mx-auto text-center">
                                <h3 className="content-header-title content-header-title2 mb-0 m-auto text-center w-25">{this.state.selectedProductCode["ProductCode"]}</h3>
                            </div>

                            <table className="table table-borderless table-sm mb-0">
                                <tbody>
                                    <tr>
                                        <td className="text-color text-bold-700">Device</td>
                                        <td>{this.state.selectedProductCode["Device"]}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-color text-bold-700">Definition</td>
                                        <td>{this.state.selectedProductCode["Definition"]}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>

                    </div>
                </Modal>
            </>
        );
    }
}