import { getColorPrimary } from "~/libs/helpers";

export function LoaderOne() {
    return (
        <div class="woovina-page-loader">
            <div class="lds-facebook">
                <div />
                <div />
                <div />
            </div>
            <style jsx>{`
                .lds-facebook {
                    /* change color here */
                    color: ${getColorPrimary()};
                }
                .lds-facebook,
                .lds-facebook div {
                    box-sizing: border-box;
                }
                .lds-facebook {
                    display: inline-block;
                    position: relative;
                    width: 60px;
                    height: 60px;
                }
                .lds-facebook div {
                    display: inline-block;
                    position: absolute;
                    left: 8px;
                    width: 16px;
                    background: currentColor;
                    animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1)
                        infinite;
                }
                .lds-facebook div:nth-child(1) {
                    left: 8px;
                    animation-delay: -0.24s;
                }
                .lds-facebook div:nth-child(2) {
                    left: 32px;
                    animation-delay: -0.12s;
                }
                .lds-facebook div:nth-child(3) {
                    left: 56px;
                    animation-delay: 0s;
                }
                @keyframes lds-facebook {
                    0% {
                        top: 8px;
                        height: 64px;
                    }
                    50%,
                    100% {
                        top: 24px;
                        height: 32px;
                    }
                }
            `}</style>
        </div>
    );
}
export function LoaderTwo() {
    return (
        <div class="lds-ripple">
            <div />
            <div />
            <style jsx>{`
                .lds-ripple {
                    color: ${getColorPrimary()};
                }
                .lds-ripple,
                .lds-ripple div {
                    box-sizing: border-box;
                }
                .lds-ripple {
                    display: inline-block;
                    position: relative;
                    width: 60px;
                    height: 60px;
                }
                .lds-ripple div {
                    position: absolute;
                    border: 4px solid currentColor;
                    opacity: 1;
                    border-radius: 50%;
                    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1)
                        infinite;
                }
                .lds-ripple div:nth-child(2) {
                    animation-delay: -0.5s;
                }
                @keyframes lds-ripple {
                    0% {
                        top: 36px;
                        left: 36px;
                        width: 8px;
                        height: 8px;
                        opacity: 0;
                    }
                    4.9% {
                        top: 36px;
                        left: 36px;
                        width: 8px;
                        height: 8px;
                        opacity: 0;
                    }
                    5% {
                        top: 36px;
                        left: 36px;
                        width: 8px;
                        height: 8px;
                        opacity: 1;
                    }
                    100% {
                        top: 0;
                        left: 0;
                        width: 80px;
                        height: 80px;
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
export function LoaderThree() {
    return (
        <div className="lds-spinner">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <style jsx>{`
                .lds-spinner,
                .lds-spinner div,
                .lds-spinner div:after {
                    box-sizing: border-box;
                    color: ${getColorPrimary()};
                }
                .lds-spinner {
                    color: currentColor;
                    display: inline-block;
                    position: relative;
                    width: 80px;
                    height: 80px;
                }
                .lds-spinner div {
                    transform-origin: 40px 40px;
                    animation: lds-spinner 1.2s linear infinite;
                }
                .lds-spinner div:after {
                    content: " ";
                    display: block;
                    position: absolute;
                    top: 3.2px;
                    left: 36.8px;
                    width: 6.4px;
                    height: 17.6px;
                    border-radius: 20%;
                    background: currentColor;
                }
                .lds-spinner div:nth-child(1) {
                    transform: rotate(0deg);
                    animation-delay: -1.1s;
                }
                .lds-spinner div:nth-child(2) {
                    transform: rotate(30deg);
                    animation-delay: -1s;
                }
                .lds-spinner div:nth-child(3) {
                    transform: rotate(60deg);
                    animation-delay: -0.9s;
                }
                .lds-spinner div:nth-child(4) {
                    transform: rotate(90deg);
                    animation-delay: -0.8s;
                }
                .lds-spinner div:nth-child(5) {
                    transform: rotate(120deg);
                    animation-delay: -0.7s;
                }
                .lds-spinner div:nth-child(6) {
                    transform: rotate(150deg);
                    animation-delay: -0.6s;
                }
                .lds-spinner div:nth-child(7) {
                    transform: rotate(180deg);
                    animation-delay: -0.5s;
                }
                .lds-spinner div:nth-child(8) {
                    transform: rotate(210deg);
                    animation-delay: -0.4s;
                }
                .lds-spinner div:nth-child(9) {
                    transform: rotate(240deg);
                    animation-delay: -0.3s;
                }
                .lds-spinner div:nth-child(10) {
                    transform: rotate(270deg);
                    animation-delay: -0.2s;
                }
                .lds-spinner div:nth-child(11) {
                    transform: rotate(300deg);
                    animation-delay: -0.1s;
                }
                .lds-spinner div:nth-child(12) {
                    transform: rotate(330deg);
                    animation-delay: 0s;
                }
                @keyframes lds-spinner {
                    0% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
export function LoaderFour() {
    return (
        <div class="lds-circle">
            <div />
            <style jsx>{`
                .lds-circle,
                .lds-circle div {
                    box-sizing: border-box;
                    color: ${getColorPrimary()};
                }
                .lds-circle {
                    display: inline-block;
                    transform: translateZ(1px);
                }
                .lds-circle > div {
                    display: inline-block;
                    width: 64px;
                    height: 64px;
                    margin: 8px;
                    background: currentColor;
                    border-radius: 50%;
                    animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1)
                        infinite;
                }
                @keyframes lds-circle {
                    0%,
                    100% {
                        animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
                    }
                    0% {
                        transform: rotateY(0deg);
                    }
                    50% {
                        transform: rotateY(1800deg);
                        animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
                    }
                    100% {
                        transform: rotateY(3600deg);
                    }
                }
            `}</style>
        </div>
    );
}
