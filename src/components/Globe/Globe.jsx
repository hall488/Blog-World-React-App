import styles from './Globe.module.css';
import Option from './Option';
import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

function Globe() {
    const { navigateTo, menuItems } = useOutletContext();
    const svgRef = useRef(null);
    const circleRef = useRef(null);
    const [globeState, setGlobeState] = useState('auto');
    const [rotation, setRotation] = useState(0);
    const baseAngle = useRef(0);
    const mouseDown = useRef(false);
    const lastAngle = useRef(0);

    let rotationIndex = 0;

    function handleMouseMove(e) {
        let rect = e.currentTarget.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        let circle = circleRef.current.getBoundingClientRect();
        let radius = circle.height / 2;

        if (dist(x, y, rect.width / 2, rect.height / 2) < radius + 10) {
            if (e.buttons == 1) {
                setGlobeState('grabbing');
                let angle = Math.atan(
                    (y - rect.height / 2) / (x - rect.width / 2),
                );

                angle += x - rect.width / 2 > 0 ? Math.PI / 2 : -Math.PI / 2;
                angle = (angle * 180) / Math.PI;

                if (!mouseDown.current) {
                    mouseDown.current = true;
                    baseAngle.current = angle;
                }

                let adjustment =
                    (lastAngle.current + angle - baseAngle.current) % 360;
                setRotation(adjustment);
            } else {
                setGlobeState('grab');
                mouseDown.current = false;
                lastAngle.current = rotation;
            }
        }
    }

    const handleTouchMove = e => {
        let rect = e.currentTarget.getBoundingClientRect();
        let x = e.touches[0].clientX - rect.left;
        let y = e.touches[0].clientY - rect.top;

        let circle = circleRef.current.getBoundingClientRect();
        let radius = circle.height / 2;
        if (dist(x, y, rect.width / 2, rect.height / 2) < radius + 10) {
            if (e.touches.length > 0) {
                setGlobeState('grabbing');
                let angle = Math.atan(
                    (y - rect.height / 2) / (x - rect.width / 2),
                );

                angle += x - rect.width / 2 > 0 ? Math.PI / 2 : -Math.PI / 2;
                angle = (angle * 180) / Math.PI;

                if (!mouseDown.current) {
                    mouseDown.current = true;
                    baseAngle.current = angle;
                }
                let adjustment =
                    (lastAngle.current + angle - baseAngle.current) % 360;
                setRotation(adjustment);
            }
        }
    };

    const handleTouchEnd = e => {
        setGlobeState('grab');
        mouseDown.current = false;
        lastAngle.current = rotation;
    };

    const dist = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    const handleLink = async (path, item) => {
        navigateTo(`${path}/` + item._id);
    };

    const rotationCalc = index => {
        if (index == 0) return rotationIndex;

        let m = menuItems[index];
        let mp = menuItems[index - 1];

        if (m.name) {
            rotationIndex += mp.name.length * 0.4 + m.name.length * 0.4 + 5;
        } else {
            rotationIndex += mp.title.length * 0.4 + m.title.length * 0.4 + 5;
        }

        return rotationIndex;
    };

    return (
        <div className={styles.wrapper}>
            <svg
                width="22.6mm"
                height="22.6mm"
                viewBox="0 0 22.6 22.6"
                version="1.1"
                id="svg5"
                ref={svgRef}
                key="svg"
            >
                <g
                    key="layer1"
                    id="layer1"
                    transform={`translate(-106.39054,-123.72324) rotate(${rotation},117.69054,135.07186)`}
                >
                    <g
                        key="g4421"
                        className={`${styles.group}`}
                        id="g4221"
                        transform="translate(9.7500005,9.7499987)"
                        style={{ cursor: globeState }}
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <circle
                            id="path234"
                            cx="107.94054"
                            cy="125.32186"
                            r="10"
                            ref={circleRef}
                        />
                        <path
                            d="m 112.34737,116.47024 c -0.0221,0.0703 -0.32909,0.51497 -0.43846,0.59181 -0.0963,0.0677 -1.40883,0.15738 -1.62515,0.0884 -0.50964,-0.17512 -3.16333,-1.1004 -4.5189,-1.58519 l 2.285,-0.16594 1.87652,0.22264 1.20265,0.38799 z"
                            id="path339"
                        />
                        <path
                            d="m 103.39655,116.6787 c 0.55456,0.19587 1.21536,0.29227 1.63562,0.70287 0.28713,0.28052 -0.61365,1.08828 -0.3433,1.27085 0.41606,0.28096 1.21872,0.45034 1.57922,0.33948 0.45616,-0.14028 0.23421,-1.1244 0.63709,-1.27957 0.64126,-0.24699 2.43313,0.62215 2.56202,0.84063 0.0849,0.14394 -0.0417,1.27546 -0.18169,1.3843 -0.21587,0.16782 -1.01197,0.17485 -1.2778,0.19903 -0.43493,0.12251 -0.84046,2.60161 -1.90968,2.9231 -0.46121,0.009 -3.01961,-1.06332 -3.18013,-0.55484 -0.12614,0.39959 -0.33662,0.64657 0.0329,0.96453 0.44631,0.384 1.79053,1.00926 2.20547,1.2001 0.80337,0.36949 2.49192,1.24652 2.65198,1.9676 0.0555,0.25002 -0.73039,0.4775 -0.82531,0.26763 -0.62374,-0.92219 -2.65976,-0.87666 -3.32475,-1.26743 -0.70115,-0.35836 -2.53573,-1.01148 -2.75644,-1.25785 -0.2028,-0.22638 -1.205375,-2.00147 -1.254105,-2.35388 -0.05442,-0.39353 0.888115,-2.2888 1.059775,-3.36609 z"
                            id="path555"
                        />
                        <path
                            d="m 108.45608,124.50995 c -0.10658,-0.10543 0.43407,-0.97028 0.55274,-1.07553 0.13465,-0.11943 1.41828,0.16316 1.46418,0.30739 0.059,0.18529 -0.54484,0.6109 -0.62268,0.66605 -0.1211,0.0858 -1.28397,0.21118 -1.39424,0.10209 z"
                            id="path557"
                        />
                        <path
                            d="m 108.50913,126.78739 c 0.30355,-0.22858 3.28265,-0.1641 3.4448,0.0451 0.1719,0.22178 0.24484,0.78222 0.42381,0.99993 0.19234,0.23396 1.59658,0.26027 1.79236,0.6087 0.23206,0.41301 -0.18866,2.51216 -0.48869,2.82556 -0.1941,0.20276 -0.6955,0.14831 -0.96044,0.24151 -1.13374,0.37764 -2.95618,3.30172 -3.34301,2.97078 -0.35649,-0.44687 0.19569,-2.75252 -0.0699,-3.10935 -0.14745,-0.19808 -0.65773,0.0584 -0.7885,-0.15103 -0.1955,-0.31318 -1.24309,-1.84461 -1.23294,-2.17877 0.01,-0.31847 0.62695,-0.31933 0.80653,-0.56449 0.34633,-0.53734 0.0294,-1.29086 0.41598,-1.68794 z"
                            id="path559"
                        />
                    </g>
                    {menuItems.map((item, index) => {
                        return (
                            <Option
                                key={item._id}
                                word={item.name ? item.name : item.title}
                                handleLink={() => {
                                    if (item.name) handleLink('Category', item);
                                    else handleLink('Article', item);
                                }}
                                rotation={rotationCalc(index)}
                            />
                        );
                    })}
                </g>
            </svg>
        </div>
    );
}

export default Globe;
