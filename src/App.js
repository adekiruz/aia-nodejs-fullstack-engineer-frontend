import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Component } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "", title: "", feedList: []
    }

    this.getFeedList();
  }

  async getFeedList(query = "") {
    let feedURL = new URL('http://localhost:32855/flickr-photos-feed');

    if (query) {
      query = query.replaceAll(' ', ',')
      feedURL.searchParams.append('tags', query);
    }

    const response = await fetch(feedURL);
    const body = await response.json();

    this.setState({ title: body.title, feedList: body.items })
  }

  itemCard(item) {
    const getAuthorName = author => {
      var regex = /(?<=")(.*?)(?=")/;
      var matched = regex.exec(author);

      return matched.length ? matched[0] : author;
    };
    return (
      <Card bg="secondary" border="dark" style={{ width: "100%" }} className="mb-4">
        <a target="__blank" href={item.link}><Card.Img variant="top" src={item.media.m} /></a>
        <Card.Body className="p-2">
          <Card.Title className="mb-4">{item.title}</Card.Title>
          <Card.Subtitle>Posted by <a target="__blank" href={`https://www.flickr.com/people/${item.author_id}`}>{getAuthorName(item.author)}</a></Card.Subtitle>
        </Card.Body>
        <Card.Footer className="text-right">
          {item.published}
        </Card.Footer>
      </Card>
    );
  }

  render() {
    const { title, query, feedList } = this.state;

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
        <Row>
          <Col md={12} className="d-flex justify-content-center">
            {feedList.length === 0
              ? <h2 className="screen-centered"><i>No results</i></h2>
              : <div> {feedList.map((item, i) => (
                <div key={i}>{this.itemCard(item)}</div>
              ))} </div>
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
