import React, { Component } from 'react'
import styles from './GearIcon.module.css'

export default class GearIcon extends Component {
    render() {
        let status = this.props.active ? styles.active : styles.inactive;
        return (
            <svg className={styles.gearIcon} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18'>
                <defs />
                <g id='Layer_1' data-name='Layer 1'>
                    <path className={status} d='M16.08,7.38H14.29a6.24,6.24,0,0,0-.36-.88l1.26-1.26a1.07,1.07,0,0,0,0-1.5l-.8-.8a1.09,1.09,0,0,0-1.5,0L11.63,4.21a4.7,4.7,0,0,0-.87-.36V2.06A1.06,1.06,0,0,0,9.7,1H8.57A1.05,1.05,0,0,0,7.51,2.06V3.85a4.7,4.7,0,0,0-.87.36L5.37,2.94a1.08,1.08,0,0,0-1.49,0l-.8.8a1.06,1.06,0,0,0,0,1.5L4.34,6.5A5.24,5.24,0,0,0,4,7.38H2.19a1.06,1.06,0,0,0-1.06,1V9.57a1.06,1.06,0,0,0,1.06,1H4a5.24,5.24,0,0,0,.36.88L3.08,12.76a1.06,1.06,0,0,0,0,1.5l.8.8a1.08,1.08,0,0,0,1.49,0l1.27-1.27a4.7,4.7,0,0,0,.87.36v1.79A1.05,1.05,0,0,0,8.57,17H9.7a1.06,1.06,0,0,0,1.06-1.06V14.15a4.7,4.7,0,0,0,.87-.36l1.26,1.27a1.09,1.09,0,0,0,1.5,0l.8-.8a1.07,1.07,0,0,0,0-1.5L13.93,11.5a6.24,6.24,0,0,0,.36-.88h1.79a1,1,0,0,0,1.05-1V8.43A1,1,0,0,0,16.08,7.38Zm.38,2.19a.38.38,0,0,1-.38.38H14a.32.32,0,0,0-.32.25,5,5,0,0,1-.49,1.19.32.32,0,0,0,0,.4l1.44,1.45a.38.38,0,0,1,0,.54l-.8.8a.4.4,0,0,1-.54,0l-1.44-1.45a.35.35,0,0,0-.41-.05,4.59,4.59,0,0,1-1.19.49.34.34,0,0,0-.25.33v2a.38.38,0,0,1-.38.38H8.57a.38.38,0,0,1-.38-.38v-2a.35.35,0,0,0-.26-.33,4.68,4.68,0,0,1-1.18-.49.33.33,0,0,0-.17,0,.34.34,0,0,0-.24.09L4.89,14.58a.4.4,0,0,1-.54,0l-.8-.8a.39.39,0,0,1,0-.54L5,11.79a.32.32,0,0,0,0-.4,4.59,4.59,0,0,1-.49-1.19A.33.33,0,0,0,4.23,10h-2a.38.38,0,0,1-.38-.38V8.43a.38.38,0,0,1,.38-.38h2a.33.33,0,0,0,.33-.25,4.59,4.59,0,0,1,.49-1.19.32.32,0,0,0,0-.4L3.55,4.76a.39.39,0,0,1,0-.54l.81-.8a.4.4,0,0,1,.54,0L6.34,4.87a.35.35,0,0,0,.41,0,4.68,4.68,0,0,1,1.18-.49.35.35,0,0,0,.26-.33v-2a.38.38,0,0,1,.38-.38H9.7a.38.38,0,0,1,.38.38v2a.35.35,0,0,0,.25.33,4.59,4.59,0,0,1,1.19.49.35.35,0,0,0,.41,0l1.44-1.45a.4.4,0,0,1,.54,0l.8.8a.38.38,0,0,1,0,.54L13.27,6.21a.32.32,0,0,0,0,.4,5,5,0,0,1,.49,1.19.33.33,0,0,0,.32.25h2a.38.38,0,0,1,.38.38V9.57Z'
                    />
                    <path className={status} d='M9.13,5.71a3.3,3.3,0,0,0-1.57.4.34.34,0,0,0-.13.46.33.33,0,0,0,.46.14,2.57,2.57,0,0,1,1.24-.32A2.61,2.61,0,1,1,6.52,9a2.64,2.64,0,0,1,.26-1.14.32.32,0,0,0-.15-.45.34.34,0,0,0-.45.15,3.29,3.29,0,1,0,3-1.85Z'
                    />
                </g>
            </svg>
        )
    }
}
