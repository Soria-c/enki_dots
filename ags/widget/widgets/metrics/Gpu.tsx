import { bind, Variable } from "astal"
const gpu_info = Variable("").poll(1000, "gpuinfo.sh")


export default function Gpu() {
    return (
        <box className="gpu-box">
            <icon icon="gpu_icon"/>
            <label label={bind(gpu_info).as(d => {
                if (d == "") {
                    return ""
                } else {
                    let usage = JSON.parse(d)
                    return "  " + usage.tmp+"°C" + " " + usage.usage +"%"
                }
            })}/>
        </box>
    )
}