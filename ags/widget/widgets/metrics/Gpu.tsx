import { bind, Variable } from "astal"
const gpu_info = Variable("").poll(2000, "gpuinfo.sh")


export default function Gpu() {
    return (
        <box className="gpu-box">
            {/* <icon icon="gpu_icon"/>
            <label label={bind(gpu_info).as(d => {
                if (d == "") {
                    return ""
                } else {
                    let usage = JSON.parse(d)
                    return "  " + usage.tmp+"°C" + " " + usage.usage +"%"
                }
            })}/> */}
            <circularprogress className="media_cir"
                                      rounded={false}
                                      inverted={false}
                              
                              startAt={0.75}
                              value={bind(gpu_info).as(d => {
                                if (d == "") {
                                    return -0.25
                                }
                                let usage = JSON.parse(d)
                                // print(d)
                                // let base = d.split("\n")
                                // let usage = Number(base[1].split("M")[0].trim())
                                // let total = Number(base[0].split("M")[0].trim())
                                // let n = 100 - Number(JSON.parse(d).sysstat.hosts[0].statistics[0]["cpu-load"][0].idle)
                                // console.log("asd");
                                
                                // console.log(usage);
                                // console.log(usage/total);
                                
                                return  (usage.usage/ 100) - 0.25
                              })}
                              >
                                <label label={bind(gpu_info).as(d => {
                                if (d == "") {
                                    return ""
                                }
                                let usage = JSON.parse(d)
                                // print(d)
                                // let base = d.split("\n")
                                // let usage = Number(base[1].split("M")[0].trim())
                                // let total = Number(base[0].split("M")[0].trim())
                                // let n = 100 - Number(JSON.parse(d).sysstat.hosts[0].statistics[0]["cpu-load"][0].idle)
                                // console.log("asd");
                                
                                // console.log(usage);
                                // console.log(usage/total);
                                
                                return  usage.tmp + "°"
                              })} css={"font-size: 9px"}/>

            </circularprogress>
        </box>
    )
}