import Battery from "gi://AstalBattery"
import { bind, Variable } from "astal"

const battery = Battery.get_default()

print("battery")
print(battery.capacity)

print(battery.percentage)

export default function Bat() {
    return (
        <box visible={battery.capacity != 0}
             className="component-box" >
            <label label={bind(battery, "percentage").as(s => `${s}%`)}/>
        </box>
    )

}