import styles from './Globe.module.css';
import { v4 as uuidv4 } from 'uuid';

function Option({ word, rotation, handleLink }) {
    const a5 = [117.32, 124.28, 0.75];
    const a26 = [116.01, 124.4, 3.36];
    const ap = [
        (a26[0] - a5[0]) / 21,
        (a26[1] - a5[1]) / 21,
        (a26[2] - a5[2]) / 21,
    ];

    let arc_params = [
        a5[0] + ap[0] * (word.length - 3),
        a5[1] + ap[1] * (word.length - 3),
        a5[2] + ap[2] * (word.length - 3),
    ];

    let uuid = uuidv4();

    return (
        <>
            <g transform={`rotate(${rotation},117.69054,135.07186)`} id="#test">
                <path
                    onClick={handleLink}
                    className={styles.border}
                    id={uuid}
                    d={`m ${arc_params[0]}, ${arc_params[1]} a 10.75,10.75 0 0 1 ${arc_params[2]},0`}
                />
                <path
                    className={styles.item}
                    id={uuid}
                    d={`m ${arc_params[0]}, ${arc_params[1]} a 10.75,10.75 0 0 1 ${arc_params[2]},0`}
                />
                <text
                    xmlSpace="preserve"
                    id="text15425"
                    className={styles.itemText}
                >
                    <textPath
                        xlinkHref={`#${uuid}`}
                        startOffset="50%"
                        id="textPath15427"
                        dy="0.079999998"
                        dominantBaseline="central"
                    >
                        {word}
                        <tspan id="tspan15423" />
                    </textPath>
                </text>
            </g>
        </>
    );
}

export default Option;
