import React from 'react';
import { debounce } from 'lodash';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            query: '',
            borrowedItems: [],
            displayBorrow: false
        }
    }
    componentDidMount() {
        const apiUrl = 'http://localhost:3000/books';
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => this.setState({ books: data }))

    }
    onSearchChange = debounce(e => {
        this.setState({ query: e });
        this.handleSearchChange(e);
    }, 50);

    handleSearchChange = (searchString) => {

        let books = [...this.state.books];
        if (searchString !== '') {
            books = books.filter(book => {
                let title = book.title.toUpperCase();
                let category = book.category.toUpperCase();
                let author = book.author.toUpperCase();
                return title.includes(searchString.toUpperCase()) || category.includes(searchString.toUpperCase()) || author.includes(searchString.toUpperCase());
            });
            this.setState({ books: books })
        }
        else {
            const apiUrl = 'http://localhost:3000/books';
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => this.setState({ books: data }))
        }

    }
    onBorrowClick = (book) => {
        if (this.state.borrowedItems.length !== 3) {
            var item = this.state.borrowedItems.find(item => item.id === book.id);
            if (item) {
                window.alert('You have already borrowed this book');
            }
            else {
                var borrowed = [...this.state.borrowedItems, book];
                this.setState({ borrowedItems: borrowed });
            }
        }
        else {
            window.alert('You have already borrowed three books');
        }
    }
    render() {
        console.log(this.state.books)
        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <input
                        type="text"
                        className="txt-i"
                        placeholder={"Search Books"}
                        onChange={e => {
                            this.onSearchChange(e.target.value);
                        }}
                        id="search_books"
                        style={{ width: '80%', margin: '20px' }}
                    />
                    <div>
                        <div style={{ color: 'blue', textDecoration: 'underline' }} onClick={() => { this.setState({ displayBorrow: true }) }}>Borrowed Books</div>
                        {this.state.displayBorrow ?
                            <div style={{ width: '200px', height: '400px', border: '1px solid #ccc', padding: '20px', margin: '50px', zIndex: '999' }}>
                                {this.state.borrowedItems.length ?
                                    this.state.borrowedItems.map(book => {
                                        return (
                                            <div style={{ width: '180px', height: '40px', border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                                                <div>{book.title}</div>
                                                <div>{book.author}</div>
                                                <div>{book.category}</div>
                                            </div>
                                        )
                                    })
                                    : <div>No Books Borrowed</div>}
                            </div> : ''
                        }
                    </div>
                </div>
                <div>
                    {this.state.books.length ?
                        this.state.books.map((book) => {
                            return (
                                <div style={{ display: "flex", width: '1200px', height: '40px', border: '1px solid #ccc', padding: '20px', margin: '50px' }}>
                                    <div style={{ fontWeight: 'bold', width: '200px' }}>{book.title}</div>
                                    <div style={{ width: '200px' }}>By:{book.author}</div>
                                    <div style={{ width: '200px' }}>{book.category}</div>
                                    <div style={{ width: '200px', color: (book.status === "available" ? "green" : book.status === "borrowed" ? "hotpink" : book.status === "returned" ? "yellowgreen" : "red") }}>{book.status}</div>
                                    {book.status === "borrowed" ?
                                        <div style={{ width: '200px' }}>{book.returnDate}</div>
                                        :
                                        <div style={{ width: '200px' }}></div>
                                    }
                                    {book.status === "available" ?
                                        <button onClick={() => this.onBorrowClick(book)}>Borrow</button> : ''}
                                </div>)
                        })
                        : <div>No Books Found</div>}
                </div>
            </div>
        )
    }
}   