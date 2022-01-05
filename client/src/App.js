import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import axios from "axios";
import { saveAs } from "file-saver";
import { Form, Button, DropdownButton, Dropdown, Alert } from "react-bootstrap";
import Title from "./Title";

class App extends Component {
  //state component
  state = {
    name: "",
    receiptId: 0,
    price1: 0,
    price2: 0,
    currecies: [],
    selectedCurrency: "",
    download: false,
  };

  //records every change of thecomponent
  handleChange = ({ target: { value, name } }) =>
    this.setState({ [name]: value });

  //create pdf and download when the creation is successful
  createAndDownloadPDF = () => {
    axios
      .post("http://localhost:5000/create-pdf", this.state)
      .then(() =>
        axios.get("http://localhost:5000/fetch-pdf", { responseType: "blob" })
      )
      .then((res) => {
        this.setState({ download: true });
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "invoice.pdf");
      });
  };

  getCurrencies = () => {
    axios
      .get("https://openexchangerates.org/api/currencies.json")
      .then((res) => {
        if (res.request.status === 200) {
          this.setState({ currecies: Object.keys(res.data) });
        }
      });
  };

  handleSelect = (e) => {
    this.setState({ selectedCurrency: e });
  };

  render() {
    return (
      <Form>
        <Title />
        <Form.Group controlId="formGroupName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            name="name"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formGroupReceipt">
          <Form.Label>Receipt ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Receipt Id"
            name="receiptId"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formGroupPrice1">
          <Form.Label>Price 1</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price 1"
            name="price1"
            onChange={this.handleChange}
            min="1"
          />
        </Form.Group>
        <Form.Group controlId="formGroupPrice2">
          <Form.Label>Price 2</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price 2"
            name="price2"
            onChange={this.handleChange}
            min="1"
          />
        </Form.Group>
        <div className="d-flex flex-row">
          <DropdownButton
            id="dropdown-basic-button"
            title="select currency"
            size="small"
            onClick={this.getCurrencies}
            onSelect={this.handleSelect}>
            {this.state.currecies.map((item) => {
              return <Dropdown.Item eventKey={item}>{item}</Dropdown.Item>;
            })}
          </DropdownButton>
          <div className="px-3 align-self-center">
            Selected Currency : {this.state.selectedCurrency ? this.state.selectedCurrency: 'Null'}
          </div>
        </div>
        <div className="mt-2 mb-2">
          <Button
            variant="primary"
            size="lg"
            onClick={this.createAndDownloadPDF}>
            Download PDF
          </Button>
        </div>
        {this.state.download && (
          <div className="mt-2">
            <Alert variant="success">Pdf Downloaded successfully</Alert>
          </div>
        )}
      </Form>
    );
  }
}

export default App;
