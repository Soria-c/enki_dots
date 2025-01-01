import {bind, Variable} from "astal"

const ram_usage = Variable("").poll(2000, "vmstat -s -S M")


export default function Ram() {
    return (
        <box className="ram-box"
             spacing={8}>
            {/* <icon icon="ram_memory"/>
            <label label={bind(ram_usage).as(d =>{
                if (d == "") {
                    return ""
                } else {
                    let usage = Number(d.split("\n")[1].split("M")[0].trim()) / 1024
                    return usage.toFixed(2) +"GB"
                }
            })}/> */}

            <circularprogress className="media_cir"
                                      rounded={false}
                                      inverted={false}
                              
                              startAt={0.75}
                              value={bind(ram_usage).as(d => {
                                if (d == "") {
                                    return -0.25
                                }
                                // print(d)
                                let base = d.split("\n")
                                let usage = Number(base[1].split("M")[0].trim())
                                let total = Number(base[0].split("M")[0].trim())
                                // let n = 100 - Number(JSON.parse(d).sysstat.hosts[0].statistics[0]["cpu-load"][0].idle)
                                // console.log("asd");
                                
                                
                                return  (usage/ total) - 0.25
                              })}>
                                <label label={bind(ram_usage).as(d => {
                                if (d == "") {
                                    return ""
                                }
                                // print(d)
                                let base = d.split("\n")
                                let usage = Number(base[1].split("M")[0].trim()) / 1024
                                // let total = Number(base[0].split("M")[0].trim())
                                // let n = 100 - Number(JSON.parse(d).sysstat.hosts[0].statistics[0]["cpu-load"][0].idle)
                                // console.log("asd");
                                
                                // console.log(usage);
                                // console.log(usage/total);
                                
                                return  (usage).toFixed(0)+"g"
                              })} css={"font-size: 8px"}/>

            </circularprogress>
        </box>
    )
}