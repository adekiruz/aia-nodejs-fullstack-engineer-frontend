import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Component } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "", title: "", feedList: []
    }
  }
   
  render() {
    const { title, query } = this.state;
    
    return (
      <Container className="mb-5">
        <Row>
          <Col md={6}><h1>FLICKR PHOTOS FEED</h1></Col>
          <Col md={6} className="d-flex justify-content-end">
            <Form inline onSubmit={this.searchByInput}>
              <Form.Label htmlFor="tags" srOnly>
                Search with tags
              </Form.Label>
              <Form.Control
                className="mb-2 mr-sm-2"
                id="tags"
                placeholder="Search with tags..."
                value={query}
                onChange={e => this.setState({ query: e.target.value })}
              />
              <Button type="submit" className="mb-2">
                Go!
              </Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="d-flex justify-content-start">
            <h5 className="mt-3 mb-3">{title && `${title}:`}</h5>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
