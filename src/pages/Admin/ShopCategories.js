import React, {Component} from "react";
import {connect} from "react-redux";
import {mapDispatchToProps, mapStateToProps, stateKeys,} from "../../redux/actions";
import Endpoint from "../../utils/endpoint";
import {Col, Modal, Row} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {Link} from "react-router-dom";


class ShopCategories extends Component {
    state = {
        // createShopServiceCard:true
    };

    changeText = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };
    loadEditData = (data) => {
        this.setState({
            name: data.name,
            description: data.description,
            current_state_title: "Update",
            slug: data.slug,
            successMsg: false,
            id: data.id,
            createShopCategoryCard: true
        })
        console.log(data, "Service Data")
    }


    handleCreateCategory = () => {
        var name = document.getElementById("name").value;
        var desc = document.getElementById("desc").value;

        if (name == "" || desc == "" || name == " " || desc == " ") {
            this.setState({errorMsg: true, content_message: "All fields are to be filled"})
            setTimeout(() => {
                this.setState({errorMsg: false})
            }, 3000)
            return false

        }
        this.setState({spinner: true})
        const payload = {
            name: this.state.name,
            description: this.state.description,
        };
        Endpoint.createShopCategory(payload)
            .then((res) => {
                this.setState({successMsg: true, spinner: false, createShopCategoryCard: false});
                this.componentDidMount();
            })
            .catch((error) => {
                console.log(error + "error")
                this.setState({
                    spinner: false,
                    errorMsg: true,
                    content_message: "Oops! Request Failed. Check that you have an active internet connection and try again"
                })
                setTimeout(() => {
                    this.setState({errorMsg: false})
                }, 3000)
            });

    };

    handleUpdateCategory = () => {
        this.setState({spinner: true})
        const payload = {
            name: this.state.name,
            description: this.state.description,
        };
        Endpoint.editShopCategory(payload, this.state.slug)
            .then((res) => {
                this.setState({successMsgUpdate: true, spinner: false, createShopCategoryCard: false});
                this.componentDidMount();
            })
            .catch((error) => {
                console.log(error + "error")
                this.setState({
                    errorMsg: true,
                    content_message: "Oops! An error occured. Check that you have an active internet connection and try again",
                })

                setTimeout(() => {
                    this.setState({
                        errorMsg: false
                    })
                }, 4000)
            });
    };

    getShopCategories = () => {
        Endpoint.getShopCategories()
            .then(res => {
                this.setState({shopCategories: res.data.data});
            })
    };


    handleDeleteShopCategory = () => {
        this.setState({deleteModal: false})
        Endpoint.deleteShopCategory(this.state.slug)
            .then((res) => {
                console.log(res)
                this.componentDidMount();
            })
    }

    promptDelete = (a) => {
        // this.loadData(a);
        this.setState({
            deleteModal: true,
            name: a.name,
            slug: a.slug,
        })
    }

    // loadData = (data) => {
    //   this.setState({
    //     id:data.id

    //   })
    // }


    componentDidMount() {
        this.props.setState("home", stateKeys.PAGE_CLASS);
        this.props.setState("Sample content for dialog", stateKeys.DIALOG_CONTENT);
        this.getShopCategories();
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
                        <p>Shop Category updated successfully !</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-custom"
                            onClick={() => {
                                this.setState({successMsgUpdate: false});
                            }}
                        >
                            Ok
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.deleteModal} size="sm">
                    <Modal.Header>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Delete {this.state.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-custom"
                                onClick={this.handleDeleteShopCategory}
                        >
                            <i className="czi-check mr-2"/>
                            Confirm
                        </button>

                        <button className="btn btn-outline-danger" onClick={() => {
                            this.setState({deleteModal: false})
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
                                Categories
                            </li>
                        </ol>
                    </nav>

                    <div className="d-flex justify-content-between flex-wrap align-items-center">
                        <h2 className="mt-lg-1 pt-lg-1">Shop Categories</h2>

                        <button className="btn btn-pink mt-2"
                                onClick={() => {
                                    this.setState({
                                        createShopCategoryCard: true,
                                        successMsg: false,
                                        name: "",
                                        description: "",
                                        slug: "",
                                        current_state_title: "Add"
                                    });
                                }}
                        >
                            <i className="czi-add mr-2"/>
                            Create Category
                        </button>
                    </div>

                </div>

                <div className="pt-1 pb-5">

                    <section>
                        <div className="box-shadow rounded-lg overflow-hidden p-3 bg-white">
                            <div className="pt-1 pb-5">
                                <section className="mb-3">
                                    <div className="mt-3">
                                        <div className="table-responsive">
                                            <table className="table table-hover">

                                                <thead className="thead-light">
                                                <tr className="font-weight-bold">
                                                    <td>S/No</td>
                                                    <td>Category Name</td>
                                                    <td>Description</td>
                                                    <td>Date Created</td>
                                                    <td>Action</td>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {this.state.shopCategories &&
                                                this.state.shopCategories.map((a, b) => {
                                                    return (
                                                        <tr>
                                                            <td>{b + 1}</td>
                                                            <td>
                                                                {a.name}
                                                            </td>
                                                            <td>{a.description}</td>


                                                            <td>{a.created_at.slice(0, 10)}</td>

                                                            <td>
                                                                <button
                                                                    className="btn btn-outline-green-dark btn-sm mr-2"
                                                                    onClick={() => this.loadEditData(a)}
                                                                >
                                                                    <i className="czi-edit"/>
                                                                </button>

                                                                <button className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => this.promptDelete(a)}
                                                                >
                                                                    <i className="czi-trash"/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}

                                                {!this.state.shopCategories ? <tr>
                                                    <td>&nbsp;</td>
                                                    <td>&nbsp;</td>
                                                    <td>
                                                        <div className="sweet-loading">
                                                            <ClipLoader
                                                                css={override}
                                                                size={60}
                                                                color={"#FF9595"}
                                                                loading={this.state.spinner}
                                                            />
                                                        </div>
                                                    </td>

                                                </tr> : null}
                                                </tbody>


                                            </table>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </section>
                </div>
                <form>

                    <Modal show={this.state.successMsg} size="sm">
                        <Modal.Header>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Shop Category was created
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

                    <Modal show={this.state.createShopCategoryCard} size="lg">
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {this.state.current_state_title} Shop Category
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
                    <span className="input-group-text">
                      <i className="czi-edit"/>
                    </span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="name"
                                            defaultValue={this.state.name}
                                            placeholder="Category Name"
                                            required
                                            id="name"

                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={6}>
                                    <div className="input-group-overlay form-group">
                                        <div className="input-group-prepend-overlay">
                    <span className="input-group-text">
                      <i className="czi-edit"/>
                    </span>
                                        </div>
                                        <input
                                            className="form-control prepended-form-control"
                                            type="text"
                                            onChange={this.changeText}
                                            name="description"
                                            defaultValue={this.state.description}
                                            placeholder="Category Description"
                                            required
                                            id="desc"
                                        />
                                    </div>
                                </Col>
                            </Row>

                            {/* <Row>
              <Col xs={6} md={6}>
                <div className="input-group-overlay form-group">
                  <div className="input-group-prepend-overlay">
                    <span className="input-group-text">
                      <i className="czi-time" />
                    </span>
                  </div>
                  <input
                    className="form-control prepended-form-control"
                    type="text"
                    onChange={this.changeText}
                    name="slug"
                    defaultValue={this.state.slug}
                    placeholder="Category Slug"
                    required
                    id="slug"
                  />
                </div>
              </Col>
             
             
            </Row>           */}

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
                                onClick={this.handleCreateCategory}
                            >
                                <i className="czi-check mr-2"/>
                                Add Category
                            </button> : this.state.current_state_title == "Update" ?

                                <button
                                    className="btn btn-custom"
                                    onClick={this.handleUpdateCategory}
                                >
                                    <i className="czi-check mr-2"/>
                                    Update Category
                                </button> : null
                            }

                            <button
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    this.setState({createShopCategoryCard: false});
                                }}
                            >
                                Close
                            </button>
                        </Modal.Footer>
                    </Modal>


                </form>

            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopCategories);
