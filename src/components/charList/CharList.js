import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';
import MarvelService from '../../services/marvelService';
import { Component } from 'react';
import ErrorMessage from '../errorMsg/errorMsg';
import Spinner from '../spinner/spinner';
import PropTypes from 'prop-types';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    marvelService = new MarvelService();

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService
        .getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    componentDidMount() {
        this.onRequest();
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {

        let ended = newCharList.length < 9 ? true : false;

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    itemRefs = [];

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'))
    }

    renderItems(arr) {
        const items = arr.map((item) => {
            return (
            <li className="char__item"
                key={item.id}
                onClick={() => this.props.onCharSelected(item.id)}>
                <img src={item.thumbnail} alt={item.name}/>
                <div className="char__name">{item.name}</div>
            </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charEnded ? 'none' : 'block'}}>
                    <div className="inner">{newItemLoading ? 'Loading...' : 'More'}</div>
                </button>
            </div>
        )
    }
}

export default CharList;
