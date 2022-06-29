import React from 'react'
import './Header.css'
import SearchIcon from '@material-ui/icons/Search'
import ShoppingBasket from '@material-ui/icons/ShoppingCart'
import { Link } from 'react-router-dom';

// 이렇게 import './Header.css' 적용하면 추후에 css component끼리 겹치는 일 생길 수 있음
// 추후 import styles from ~.css 로 적용하고, className을 'header' 에서 {styles.header} 로 변경할 필요 있어보임.
// 근데 이름을 애초에 안겹치게 (classname_태그명) 으로 지으면 문제 없을 거 같기도 하고
export default function Header() {
    return (
        <div className='header'>
            <Link to='/' style={{ color: 'inherit', textDecoration: 'none' }}>
                <img className='header_logo' src='./static/images/amazon_PNG11.png' />
            </Link>
            <div className='header_search'>
                <input className='header_searchInput' type='text' />
                <SearchIcon className='header_searchIcon' />    {/* 아 이렇게 icon도 css 적용 하는 거구나 똑같이 */}
            </div>

            <div className='header_nav'>
                <div className='header_option'>
                    <span className='header_optionLineOne'>Hi</span>
                    <span className='header_optionLineTwo'>login?</span>
                </div>
                <div className='header_option'>
                    <span className='header_optionLineOne'>Back</span>
                    <span className='header_optionLineTwo'>order list</span>
                </div>
                <div className='header_option'>
                    <span className='header_optionLineOne'>Welcome</span>
                    <span className='header_optionLineTwo'>Subscribe</span>
                </div>
                <div className='header_option'> {/* 기존: header_optionBasket */}
                    <Link to='/cart' style={{ color: 'inherit', textDecoration: 'none' }}>
                        <ShoppingBasket className='header_optionLineOne' />
                    </Link>
                    <span className='header_optionLineTwo'>0</span>
                </div>
            </div>
        </div>

    )
}