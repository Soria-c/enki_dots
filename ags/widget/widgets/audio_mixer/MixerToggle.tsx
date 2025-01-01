import { Gtk, Gdk, Astal, Widget, astalify, type ConstructProps, App } from "astal/gtk3"


export default function MixerToggle() {
    return (
        <centerbox className="component-box">
            <box />
            <eventbox 
                    halign={Gtk.Align.CENTER}
                    cursor={"pointer"}
                    onClick={(self) => {
                    // self.toggleClassName("trail-open")
                    // (self.child as Widget.Icon).toggleClassName("trail-open")
                        App.toggle_window("mixer_window");
                    // (self.child as Widget.Icon).toggleClassName("trail-open")
                    
                    }}>
                <icon icon="eq5" tooltipText={"Mixer"} css={"font-size: 14px; min-width: 16px"}/>
            </eventbox>
            <box />
        </centerbox>
    )
}