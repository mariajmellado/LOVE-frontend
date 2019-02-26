import React, { Component } from 'react'
import styles from './ComponentIndex.module.css'
import { Link } from "react-router-dom";
import Button from '../Button/Button';

export default class ComponentIndex extends Component {
    render() {
        return (
            <div className={styles.container}>
                <h1 className={styles.header}>
                    Component index
                </h1>
                <ol className={styles.linkList}>
                    <li className={styles.linkListItem}><Link to='/health-status-summary'>Health status summary</Link></li>
                    <li className={styles.linkListItem}><Link to='/dm-flow'>Data Management Flow</Link></li>
                    <li className={styles.linkListItem}><Link to='/time-series'>Time Series</Link></li>
                    <li className={styles.linkListItem}><Link to='/login'>Login</Link></li>
                    <li className={styles.linkListItem}><Button onClick={this.props.logout}>Logout</Button></li>
                </ol>
            </div>
        )
    }
}
