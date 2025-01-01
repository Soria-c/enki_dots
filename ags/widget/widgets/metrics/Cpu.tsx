import { bind, Variable } from "astal"
import Pango from "gi://Pango?version=1.0"

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
            {/* <label label={bind(wp!.audio, "streams").as( d => {
                print("streeeee")
                print(d.length)
                // print(d[0]?.description)
                print(d[0]?.description)
                print()
                return ""
            })}/> */}

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
             css="min-width: 25px; margin-left: 5px">
            {/* <icon icon="cpu_icon"/>
            <Temp />
            <Usage /> */}
            <circularprogress className="media_cir"
                                      rounded={false}
                                      inverted={false}
                              
                              startAt={0.75}
                              value={bind(cpu_usage).as(d => {
                                if (d == "") {
                                    return -0.25
                                }
                                // print(d)
                                let n = 100 - Number(JSON.parse(d).sysstat.hosts[0].statistics[0]["cpu-load"][0].idle)
                                // console.log("asd");
                                
                                // console.log(n);
                                
                                return  (n/ 100) - 0.25
                              })}>
                                <label label={bind(cpu_info).as(d => {
                                    if (d == "") {
                                        return ""
                                    }
                                    let n = Number(d.split("\n")[2].split("+")[1].substring(0, 2))
                                    // return d.split("\n")[2].split("+")[1].substring(0, 2) + "°C"
                                    return n+ "°"
                                })} 
                                css={"font-size: 9px"}
                                // wrap
                                // maxWidthChars={2}
                                // wrapMode={Pango.WrapMode.WORD_CHAR}
                                />

            </circularprogress>
        </box>
    )
}