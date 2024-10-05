import hoverText from "./hoverText.module.css"

export default function HoverText({ text }) {
    return <span className={`${hoverText.hoverText} relative`}>{text}</span>
}