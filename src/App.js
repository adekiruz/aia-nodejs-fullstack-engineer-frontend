import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Component } from 'react';
import { Button, Container, Row, Col, Form, Card, Spinner, Badge } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      query: "", title: "", feedList: [], isLoading: true, paginatedFeedList: [], currentPage: 1, perPage: 4, totalPage: 0
    }

    this.getFeedList();
    this.searchByInput = this.searchByInput.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  async getFeedList(query = "") {
    this.setState({ isLoading: true, feedList: [], paginatedFeedList: [] });
    let feedURL = new URL('http://localhost:32855/flickr-photos-feed');

    if (query) {
      query = query.replaceAll(' ', ',')
      feedURL.searchParams.append('tags', query);
    }

    const response = await fetch(feedURL);
    const body = await response.json();

    const { currentPage, perPage } = this.state;
    
    const paginatedFeedList = this.paginatingFeed(body.items, currentPage, perPage);
    this.setState({ title: body.title, feedList: body.items, paginatedFeedList, totalPage: Math.ceil(body.items.length / perPage), isLoading: false })
  }

  searchByInput(e) {
    e.preventDefault();

    this.getFeedList(this.state.query);
  }

  searchByTag(tag) {
    this.getFeedList(tag);
  }

  paginatingFeed(source, currentPage, perPage) {
    return source.slice((currentPage * perPage) - perPage, (currentPage * perPage));
  }

  handlePrev() {
    const { feedList, currentPage, perPage } = this.state;
    window.scrollTo(0, 0);

    const decrementCurrentPage = currentPage - 1;
    const paginatedFeedList = this.paginatingFeed(feedList, decrementCurrentPage, perPage);
    this.setState({ paginatedFeedList, currentPage: decrementCurrentPage })
  }

  handleNext() {
    const { feedList, currentPage, perPage } = this.state;
    window.scrollTo(0, 0);

    const incrementCurrentPage = currentPage + 1;
    const paginatedFeedList = this.paginatingFeed(feedList, incrementCurrentPage, perPage);
    this.setState({ paginatedFeedList, currentPage: incrementCurrentPage })
  }

  itemCard(item) {
    const formatDate = s => new Date(s).toLocaleDateString(undefined, { dateStyle: 'long' });
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
          <Card.Subtitle className="mt-4">
            <div className="mb-2">Tags:</div>
            <div>
              {(item.tags.split(' ')).map((tag, i) => {
                return (
                  <Badge key={tag + i} style={{ cursor: "pointer" }} variant="danger" className="mr-2 mb-1 p-1" onClick={(e) => {
                    this.setState({ query: tag });
                    this.searchByTag(tag)
                  }}>{tag}</Badge>
                );
              })}
            </div>
          </Card.Subtitle>
        </Card.Body>
        <Card.Footer className="text-right">
          {formatDate(item.published)}
        </Card.Footer>
      </Card>
    );
  }

  render() {
    const { title, query, feedList, paginatedFeedList, isLoading, currentPage, perPage, totalPage } = this.state;

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
            {isLoading ? <Spinner role="loading-spinner" animation="border" variant="danger" className="screen-centered" /> : paginatedFeedList.length === 0
              ? <h2 className="screen-centered"><i>No results</i></h2>
              : <div> {paginatedFeedList.map((item, i) => (
                <div key={i}>{this.itemCard(item)}</div>
              ))} </div>
            }
          </Col>
        </Row>

        {feedList.length > perPage && (
          <Row>
            <Col className="d-flex justify-content-between">
              <Button disabled={currentPage <= 1} style={{ width: '5rem' }} onClick={this.handlePrev} >prev</Button>
              <div>Page {currentPage} </div>
              <Button disabled={currentPage >= totalPage} style={{ width: '5rem' }} onClick={this.handleNext}>next</Button>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}

export default App;
