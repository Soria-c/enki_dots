import { Widget } from "../../../../../../../usr/share/astal/gjs/gtk3";
import Cpu from "./Cpu";
import Gpu from "./Gpu";
import Ram from "./Ram";

export default function Metrics() {
    return (
        <box spacing={10}
             className="component-box">
            <Cpu />
            <Ram />
            <Gpu />
            {/* <Widget.Separator /> */}
        </box>
    )
}