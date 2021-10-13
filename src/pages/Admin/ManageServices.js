import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {Col, Modal, Row} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {currencyFormat, durationCovert, handleAxiosError} from "../../utils/helpers"
import {Link} from "react-router-dom";
import {nanoid} from 'nanoid';
import axios from 'axios';
import {printOrder} from "../../utils/cart";
import Pagination from "react-js-pagination";


class ManageServices extends Component {
    state = {
        searchText: "",
        searching: false,
        nothingFound: false,
    };
    
    searchWithQuery = () => {
        this.setState({searching: true});
        const payload = {
            search: this.state.searchQuery,
        };
        
        Endpoint.searchServices(payload)
            .then(res => {
                this.setState({shopServices: res.data.data, searching: true, loading: false});
            })
            .catch((error) => {
                console.log(error + "error");
                handleAxiosError(error);
                
                setTimeout(() => {
                    this.setState({
                        loading: false
                    })
                }, 4000)
            })
            .finally(this.setState({loading: false}));
    };
    
    setSearchText = (e) => {
        var text = e.target.value;
        this.setState({searchText: text, searchQuery: text});
    };
    
    toggleSearching = () => {
        this.setState({searching: !this.state.searching});
        this.getShopServices();
    };

    changeText = (event) => {
        const inKobo = ['cost', 'old_cost'];
        const target = event.target;
        const name = target.name;
        const value = target.type === "checkbox" ? target.checked :
            (inKobo.includes(name) ? target.value * 100 : target.value);

        this.setState({
            [name]: value,
        });
    };

    handleFileSelected = (e) => {
        const files = Array.from(e.target.files);
        this.setState({selectedFile: files[0]});
        console.log("file:", files[0])
    };

    loadEditData = (data) => {
        this.setState({
            service_name: data.name,
            service_description: data.description,
            service_duration: data.duration,
            cost: data.cost,
            old_cost: data.old_cost,
            createShopServiceCard: true,
            current_state_title: "Update",
            service_slug: data.slug,
            successMsg: false,
            id: data.id
        })
        console.log(data, "Service Data")
    };

    loadUsersData = (data) => {
        this.setState({
            slug: data.slug,
            addServiceWorkerCard: true,
            successMsg: false,
        })
        console.log(data, "Service Data")
    };

    setSelectedWorker = (e) => {
        this.setState({selectedWorker: e.target.value});
        console.log(e.target.value);
    };

    setWorkerPercentage = (e) => {
        this.setState({percentage: e.target.value});
        console.log(e.target.value);
    };

    handleAddServiceWorker = () => {
        if (this.state.selectedWorker == null || this.state.percentage == null) {
            this.setState({errorMsg: true, content_message: "All fields are required"});
            setTimeout(() => {
                this.setState({errorMsg: false})
            }, 3000);
            return false
        }

        this.setState({spinner: true});
        const payload = {
            slug: this.state.slug,
            worker_id: this.state.selectedWorker,
            percentage: this.state.percentage
        };

        Endpoint.createServiceWorker(payload, this.state.slug)
            .then((res) => {
                this.setState({successMsgAddWorker: true, addServiceWorkerCard: false});
                this.componentDidMount();
            })
            .catch((error) => handleAxiosError(error))
            .finally(() => this.setState({spinner: false}));

    };

    handleCreateService = () => {
        var name = document.getElementById("sn").value;
        var desc = document.getElementById("desc").value;
        var duration = document.getElementById("duration").value;
        var cost = document.getElementById("cost").value;
        var oldCost = document.getElementById("oldCost").value;
        if (name == "" || desc == "" || duration == "" || cost == "" || oldCost == "") {
            this.setState({errorMsg: true, content_message: "All fields are to be filled"})
            setTimeout(() => {
                this.setState({errorMsg: false})
            }, 3000)
            return false

        }
        this.setState({spinner: true});

        const re = /(?:\.([^.]+))?$/;
        let newFileName = "";
        if (this.state.selectedFile) {
            let ext = re.exec(this.state.selectedFile.name)[1];
            newFileName = "file" + "." + ext;
        }
        const payload = {
            name: this.state.service_name,
            description: this.state.service_description,
            duration: parseInt(this.state.service_duration),
            cost: parseInt(this.state.cost),
            old_cost: parseInt(this.state.old_cost)
        };
        Endpoint.createShopService(payload)
            .then((res) => {
                // this.setState({successMsg: true, createShopServiceCard: false});
                console.log(res.data.data.id);

                const imgPayload = {
                    service_id: res.data.data.id,
                    filename: newFileName,
                };
                console.log(imgPayload);
                if (this.state.selectedFile) {
                    Endpoint.getServiceImgSignedUrl(imgPayload, res.data.data.id)
                        .then((res) => {
                            this.setState({
                                s3Id: res.data.data.file_id,
                                s3Url: res.data.data.attributes.action
                            });
                            console.log(res.data.data);
                            const s3Id = res.data.data.file_id;
                            const s3Url = res.data.data.attributes.action;

                            // Create an object of formData
                            const formData = new FormData();
                            Object.keys(res.data.data.inputs).forEach(key => {
                                formData.append(key, res.data.data.inputs[key]);
                            });
                            // Actual file has to be appended last.
                            formData.append("file", this.state.selectedFile);

                            // Request made to the backend api
                            // Send formData object
                            const xhr = new XMLHttpRequest();
                            xhr.open("POST", res.data.data.attributes.action, true);
                            xhr.send(formData);
                            xhr.onload = function () {
                                console.log("success");
                                console.log(s3Id);
                                Endpoint.verifys3upload(s3Id)
                                    .then((res) => {
                                        console.log(res.data);
                                        this.setState({successMsg: true, createShopServiceCard: false});
                                    })
                                    .catch((error) => handleAxiosError(error));
                            };

                        });
                } else {
                    this.setState({successMsg: true, createShopServiceCard: false});
                    this.getShopServices();
                }
            })
            .catch((error) => handleAxiosError(error))
            .finally(() => this.setState({spinner: false}));
    };

    handleUpdateService = () => {
        this.setState({spinner: true});
        const payload = {
            name: this.state.service_name,
            description: this.state.service_description,
            duration: parseInt(this.state.service_duration),
            cost: parseInt(this.state.cost),
            ...(this.state.old_cost ? {old_cost: parseInt(this.state.old_cost)} : {}),
            // old_cost: parseInt(this.state.old_cost),
            slug: this.state.service_slug
        };

        Endpoint.editShopService(payload, this.state.service_slug)
            .then((res) => {
                this.setState({successMsgUpdate: true, createShopServiceCard: false});
                this.componentDidMount();
            })
            .catch((error) => handleAxiosError(error))
            .finally(() => this.setState({spinner: false}));
    };

    getShopServices = () => {
        Endpoint.getAllShopServices()
            .then(res => {
                this.setState({shopServices: res.data.data});
            })
    };

    getShopWorkers = () => {
        Endpoint.getShopAttendants()
            .then(res => {
                this.setState({workers: res.data.data});
            })
    };

    handleDeleteShopService = () => {
        this.setState({deleteModal: false, loading: true})
        Endpoint.deleteShopService(this.state.service_slug)
            .then((res) => {
                this.componentDidMount();
            })
            .finally(() => this.setState({loading: false}));
    }

    promptDelete = (a) => {
        // this.loadData(a);
        this.setState({
            deleteModal: true,
            service_name: a.name,
            service_slug: a.slug,
        })
    }

    promptFeature = (a) => {
        this.setState({
            featureService: true,
            selected_service: a,
            selected_service_name: a.name,
        })
    };

    promptUnfeature = (a) => {
        this.setState({
            unfeatureService: true,
            selected_service: a,
            selected_service_name: a.name,
        })
    };

    handleFeatureService = () => {
        this.setState({featureService: false, loading: true});
        const payload = {
            featured: 1,
        };

        Endpoint.editShopService(payload, this.state.selected_service.slug)
            .then((res) => {
                this.componentDidMount();
            })
            .catch((e) => handleAxiosError(e))
            .finally(() => this.setState({loading: false}));
    };

    handleUnfeatureService = () => {
        this.setState({unfeatureService: false, loading: true});
        const payload = {
            featured: 0,
        };

        Endpoint.editShopService(payload, this.state.selected_service.slug)
            .then((res) => {
                this.componentDidMount();
            })
            .catch((e) => handleAxiosError(e))
            .finally(() => this.setState({loading: false}));
    };

    componentDidMount() {
        this.getShopServices();
        this.getShopWorkers();
        // this.getWorkerTypes();
    }


    render() {

        const override = {
            display: 'block',
            margin: '0 auto',
            // borderColor: 'red',
        };
        return (
            <>

                <Modal show={this.state.successMsgUpdate} size="sm">
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <p>Shop service updated successfully !</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-custom"
                            onClick={() => {
                                this.setState({successMsgUpdate: false});
                            }}>
                            Ok
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.successMsgAddWorker} size="sm">
                    <Modal.Header></Modal.Header>
                    <Modal.Body>
                        <p>Service Worker added successfully !</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-custom"
                            onClick={() => {
                                this.setState({successMsgAddWorker: false});
                            }}>
                            Ok
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.deleteModal} size="sm">
                    <Modal.Header>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Delete {this.state.service_name}?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <button className="btn btn-custom"
                                onClick={this.handleDeleteShopService}>
                            <i className="czi-check mr-2"/>
                            Confirm
                        </button>

                        <button className="btn btn-outline-danger" onClick={() => {
                            this.setState({deleteModal: false})
                        }}>Close
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.featureService} size="sm">
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Feature <b>{this.state.selected_service_name}</b>?</p>
                        <hr/>
                        <small> Pls, note that only 4 featured items will be displayed to customers.</small>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-custom"
                                onClick={this.handleFeatureService}
                        >
                            <i className="czi-check mr-2"/>
                            Confirm
                        </button>

                        <button className="btn btn-outline-danger" onClick={() => {
                            this.setState({featureService: false})
                        }}>Close
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.unfeatureService} size="sm">
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Remove <b>{this.state.selected_service_name}</b> from featured services list?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-custom"
                                onClick={this.handleUnfeatureService}
                        >
                            <i className="czi-check mr-2"/>
                            Confirm
                        </button>

                        <button className="btn btn-outline-danger" onClick={() => {
                            this.setState({unfeatureService: false})
                        }}>Close
                        </button>
                    </Modal.Footer>
                </Modal>

                <div className="border-bottom mt-lg-2 mt-5 pt-5 pb-2 mb-2">
                    <nav className="mb-4 mt-5" aria-label="breadcrumb">
                        <ol className="breadcrumb flex-lg-nowrap">
                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="/admin">
                                    <i className="czi-home"/>
                                    Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link className="text-nowrap" to="">
                                    <i className="czi-"/> Dashboard
                                </Link>
                            </li>

                            <li className="breadcrumb-item text-nowrap active"
                                aria-current="page">
                                Services
                            </li>
                        </ol>
                    </nav>

                    <div className="row align-items-center">
                        <div className="col-lg-5">
                            <h2 className="mt-lg-1 pt-lg-1">Shop Services</h2>
                        </div>
                        
                        <div className="col-lg-7">
                            <div className="d-flex flex-wrap justify-content-center justify-content-lg-end">
                                <div className="form-inline mt-2">
                                    <input type="text" className="form-control"
                                           placeholder="Service Name"
                                           onChange={this.setSearchText}/>
                                    <button className="btn btn-green-dark" type="button"
                                            id="button-addon2" onClick={() => this.searchWithQuery()}>Search
                                    </button>
                                </div>
        
                                <div className="ml-2">
                                    <button className="btn btn-pink mt-2"
                                            onClick={() => {
                                                this.setState({
                                                    createShopServiceCard: true,
                                                    successMsg: false,
                                                    service_name: "",
                                                    service_description: "",
                                                    service_duration: "",
                                                    cost: "",
                                                    old_cost: "",
                                                    current_state_title: "Add"
                                                });
                                            }}
                                    >
                                        <i className="czi-add mr-2"/>
                                        Create a service
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                        
                    </div>

                </div>

                <div className="pt-1 pb-5">
                    <section>
                        <div className="box-shadow rounded-lg overflow-hidden p-3 bg-white">
                            <div className="pt-1 pb-5">
                                <section className="mb-3">
                                    <div className="mt-3">
                                        {
                                            this.state.searching ?
                                                <>
                                                    <p className="cursor-pointer col-12 font-weight-bold"
                                                       onClick={() => this.toggleSearching()}>
                                                        <i className="czi-arrow-left-circle mr-2"/>
                                                        Show All Services
                                                    </p>
                                                    <br/>
                                                </>
                                                : ''
                                        }
                                        {
                                            this.state.loading ?
                                                <div className="sweet-loading my-5vh mr-3">
                                                    <div className="row justify-content-center">
                                                        <div className="col-md-3">
                                                            <div className=" product-card box-shadow">
                                                                <div className="card-body">
                                                                    <ClipLoader
                                                                        css={override}
                                                                        size={70}
                                                                        color={"#FF9595"}
                                                                        loading={this.state.loading}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <section className='border-bottom pb-4'>
                                                    <div className="row">
                                                        <div className="table-responsive">
                                                            <table className="table table-hover">
            
                                                                <thead className="thead-light">
                                                                <tr className="font-weight-bold">
                                                                    <td>S/No</td>
                                                                    <td>Service Name</td>
                                                                    <td>Duration</td>
                                                                    <td>Cost</td>
                                                                    <td>Date Created</td>
                                                                    <td>Action</td>
                                                                </tr>
                                                                </thead>
            
                                                                <tbody>
                                                                {this.state.shopServices &&
                                                                this.state.shopServices.map((a, b) => {
                                                                    return (
                                                                        <tr key={b}>
                                                                            <td>{b + 1}</td>
                                                                            <td>
                                                                                {a.name}
                                                                            </td>
                                                                            <td>{durationCovert(a.duration)}</td>
                                                                            <td>{currencyFormat(a.cost)}</td>
                        
                        
                                                                            <td>{a.created_at.slice(0, 10)}</td>
                        
                                                                            <td>
                                                                                {
                                                                                    a.featured ?
                                                                                        <button
                                                                                            className="btn btn-outline-green-dark btn-sm mr-1"
                                                                                            onClick={() => this.promptUnfeature(a)}>
                                                                                            <i className="czi-star-filled"/>
                                                                                        </button>
                                                                                        :
                                                                                        <button
                                                                                            className="btn btn-outline-green-dark btn-sm mr-1"
                                                                                            onClick={() => this.promptFeature(a)}>
                                                                                            <i className="czi-star"/>
                                                                                        </button>
                                                                                }
                            
                                                                                <Link className="btn btn-outline-green-dark btn-sm"
                                                                                      to={{
                                                                                          pathname: "/admin/ServiceWorkers",
                                                                                          state: {data: a},
                                                                                      }}>
                                                                                    <i className="czi-user-circle"/>
                                                                                </Link>
                                                                                &nbsp;
                            
                                                                                {/*<button className="btn btn-outline-green-dark btn-sm"*/}
                                                                                {/*        onClick={() => this.loadUsersData(a)}>*/}
                                                                                {/*    <i className="czi-user-circle"/>*/}
                                                                                {/*</button>*/}
                                                                                {/*&nbsp;*/}
                            
                                                                                <button className="btn btn-outline-green-dark btn-sm"
                                                                                        onClick={() => this.loadEditData(a)}>
                                                                                    <i className="czi-edit"/>
                                                                                </button>
                                                                                &nbsp;
                            
                                                                                <button className="btn btn-outline-danger btn-sm"
                                                                                        onClick={() => this.promptDelete(a)}
                                                                                >
                                                                                    <i className="czi-trash"/>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
            
                                                                {/*{!this.state.shopServices ?*/}
                                                                {/*    <tr>*/}
                                                                {/*        <td colSpan={6}>*/}
                                                                {/*            <div className="sweet-loading">*/}
                                                                {/*                <ClipLoader*/}
                                                                {/*                    css={override}*/}
                                                                {/*                    size={60}*/}
                                                                {/*                    color={"#FF9595"}*/}
                                                                {/*                    loading={this.state.spinner}*/}
                                                                {/*                />*/}
                                                                {/*            </div>*/}
                                                                {/*        </td>*/}
                                                                {/*    </tr> : null}*/}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </section>
                                        }
                                        
                                    </div>
                                </section>
                            </div>
                        </div>
    
                        {this.state.listReviewData ?
                            this.state.listReviewData.last_page > 1 ?
                                <div className="row justify-content-center">
                                    <Pagination
                                        activePage={this.state.activePage ? this.state.activePage : null}
                                        itemsCountPerPage={this.state.listReviewData ? this.state.listReviewData.per_page : null}
                                        totalItemsCount={this.state.listReviewData ? this.state.listReviewData.total : null}
                                        pageRangeDisplayed={5}
                                        onChange={this.handlePageChange.bind(this)}
                                        itemClass="page-item"
                                        linkClass="page-link"
                                    />
                                </div>
                                :
                                null
                            :
                            null
                        }

                    </section>
                </div>

                <form>

                    <Modal show={this.state.successMsg} size="sm">
                        <Modal.Header>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Shop Service was created
                                successfully !</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-custom"
                                    onClick={() => {
                                        this.setState({successMsg: false})
                                    }}
                            >
                                Ok
                            </button>

                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.createShopServiceCard} size="lg">
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {this.state.current_state_title} Shop Service
                            </Modal.Title>
                        </Modal.Header>
                        {/* {this.state.successMsg ? (
            <div className="bg-success border-rad-2 text-center p-2 mb-3">
              <p className="small text-light mb-0">
                <i className="czi-bell mr-2" /> Shop Service was created
                successfully !
              </p>
            </div>
          ) : null} */}

                        {this.state.errorMsg ? (
                            <div className="bg-danger border-rad-2 text-center p-2 mb-3">
                                <p className="small text-light mb-0">
                                    <i className="czi-bell mr-2"/> {this.state.content_message}
                                </p>
                            </div>
                        ) : null}
                        <Modal.Body>

                            <br/>
                            <Row>
                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                                            <span className="input-group-text"><i className="czi-edit"/></span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="service_name"
                                            defaultValue={this.state.service_name}
                                            placeholder="Service Name"
                                            required
                                            id="sn"

                                        />
                                    </div>
                                </Col>

                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                                            <span className="input-group-text"><i className="czi-edit"/></span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="service_description"
                                            defaultValue={this.state.service_description}
                                            placeholder="Service Description"
                                            required
                                            id="desc"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                                            <span className="input-group-text"><i className="czi-time"/></span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="number"
                                            onChange={this.changeText}
                                            name="service_duration"
                                            defaultValue={this.state.service_duration}
                                            placeholder="Service Duration(mins)"
                                            required
                                            id="duration"
                                        />
                                    </div>
                                </Col>

                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                                            <span className="input-group-text"><i className="czi-naira">₦</i></span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="number"
                                            onChange={this.changeText}
                                            name="cost"
                                            defaultValue={this.state.cost / 100}
                                            placeholder="Cost"
                                            required
                                            id="cost"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                                            <span className="input-group-text"><i className="czi-naira">₦</i></span>
                                        </div>

                                        <input
                                            className="form-control prepended-form-control"
                                            type="number"
                                            onChange={this.changeText}
                                            name="old_cost"
                                            defaultValue={this.state.old_cost / 100}
                                            placeholder="Old Cost"
                                            required
                                            id="oldCost"
                                        />
                                    </div>
                                </Col>

                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                                            <span className="input-group-text">
                                                <i className="czi-image"/>
                                            </span>
                                        </div>

                                        <input
                                            className="form-control prepended-form-control"
                                            type="file"
                                            onChange={this.handleFileSelected}
                                            name="image"
                                            placeholder="Select Image"
                                            required
                                            id="image"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            {this.state.spinner ? (
                                <div className="sweet-loading">
                                    <ClipLoader
                                        css={override}
                                        size={30}
                                        color={"#FF9595"}
                                        loading={this.state.spinner}
                                    />
                                </div>
                            ) : null}
                        </Modal.Body>

                        <Modal.Footer>
                            {this.state.current_state_title == "Add" ? <button
                                className="btn btn-custom"
                                onClick={this.handleCreateService}
                            >
                                <i className="czi-check mr-2"/>
                                Add Service
                            </button> : this.state.current_state_title == "Update" ?

                                <button
                                    className="btn btn-custom"
                                    onClick={this.handleUpdateService}
                                >
                                    <i className="czi-check mr-2"/>
                                    Update Service
                                </button> : null
                            }

                            <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    this.setState({createShopServiceCard: false});
                                }}
                            >
                                Close
                            </button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.addServiceWorkerCard}>
                        <Modal.Header>
                            <Modal.Title>Add Worker to Service.</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            {this.state.errorMsg ? (
                                <div className="bg-danger border-rad-1 text-center p-2 mb-3">
                                    <p className="small text-light mb-0">
                                        <i className="czi-bell mr-2"/> {this.state.content_message}
                                    </p>
                                </div>
                            ) : null}

                            <div className="">
                                <label>Select Worker</label>
                                <select className="form-control" onChange={this.setSelectedWorker}>
                                    <option value="">Select Worker to Add</option>
                                    {
                                        this.state.workers &&
                                        this.state.workers.map((worker, i) =>
                                            <option value={worker.id} key={i}>{worker.user.name}</option>
                                        )
                                    }
                                </select>
                            </div>

                            <div className="mt-2">
                                <label>Pay Percentage</label>
                                <input type="number" className="form-control" placeholder="Pay percentage for service"
                                       onChange={this.setWorkerPercentage}/>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-green-dark"
                                    onClick={() => this.handleAddServiceWorker()}>
                                Add
                            </button>

                            <button className="btn btn-outline-danger"
                                    onClick={() => {
                                        this.setState({addServiceWorkerCard: false})
                                    }}>
                                Close
                            </button>

                        </Modal.Footer>
                    </Modal>
                </form>

            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageServices);
