import { bind, Variable } from "astal"

const cpu_info = Variable("").poll(2000, "sensors")
const cpu_usage = Variable("").poll(2000, "mpstat -P ALL 1 1 -o JSON")
// const cpu_usage = Variable("").poll(2000, ["mpstat", "-P", "ALL", "1", "1", "-o", "JSON"])


function Temp() {
    return (
        <centerbox>
            <box >
                <label label={bind(cpu_info).as(d => {
                    if (d == "") {
                        return ""
                    }
                    return d.split("\n")[2].split("+")[1].substring(0, 2)
                })}/>
            </box>
            <box></box>
            <label label="°C"/>

        </centerbox>


    )
}

function Usage() {
    return (
        <label label={bind(cpu_usage).as(d => {
            if (d == "") {
                return ""
            }
            let usage = 100 - Number(JSON.parse(d).sysstat.hosts[0].statistics[0]["cpu-load"][0].idle)
            return usage.toFixed(0) + "%"
        })}/>
    )
}

export default function Cpu() {
    return (
        <box spacing={5}
             css="min-width: 75px;">
            <icon icon="cpu_icon"/>
            <Temp />
            <Usage />
        </box>
    )
}