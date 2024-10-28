import {bind, Variable} from "astal"

const ram_usage = Variable("").poll(2000, "vmstat -s -S M")


export default function Ram() {
    return (
        <box className="ram-box"
             spacing={8}>
            <icon icon="ram_memory"/>
            <label label={bind(ram_usage).as(d =>{
                if (d == "") {
                    return ""
                } else {
                    let usage = Number(d.split("\n")[1].split("M")[0].trim()) / 1024
                    return usage.toFixed(2) +"GB"
                }
            })}/>
        </box>
    )
}