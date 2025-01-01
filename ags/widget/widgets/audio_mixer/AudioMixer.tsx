import { Gtk ,Gdk, Astal, Widget, astalify, type ConstructProps, App } from "astal/gtk3"
import { bind, Variable } from "astal"
import Wp from "gi://AstalWp"

const wp = Wp.get_default()


const ops:{[key: string]: Variable<boolean>} = {
    "Playback": Variable<boolean>(true),
    "Recording": Variable<boolean>(false),
    "Output Devices": Variable<boolean>(false),
    "Input Devices": Variable<boolean>(false)
}
// Object.entries(ops).map((kv) => {
//     print("ops")
//     print(kv)
// })
// const selected: Variable<Gtk.Widget> = Variable(ops["Playback"][1] as Gtk.Widget);

const prev = Variable<string>("Playback");
const widgets:{[key:string]:Gtk.Widget} = {}

function Options() {
    return (
        <box className="options" 
            spacing={0}>
            {Object.entries(ops).map((kv) => {
                return (
                    <eventbox onClick={() => {
                        if (prev.get() != kv[0]) {

                            ops[prev.get()].set(false);
                            kv[1].set(true)
                            prev.set(kv[0]);
                        }
                        }}
                        cursor={"pointer"}>
                        <centerbox className={bind(kv[1]).as(v => v? "option option-active": "option option-inactive")}>
                            <box />
                            <label label={kv[0]} justify={Gtk.Justification.CENTER}/>
                            <box />
                            {/* {kv[0]} */}
                        </centerbox>

                    </eventbox>
                )
            })}

        </box>
    )
}

function MixSlide(b: Wp.Endpoint, source: string) {
    
    return (

            <box vertical spacing={5}>
                <box>
                    <icon icon={b.get_description()}/>
                    <label label={b.get_description()} css={"color: white"} wrap/>
                </box>
                {/* <centerbox > */}
                    {/* <box /> */}
                    <box spacing={5}>
                        <eventbox cursor={"pointer"}
                                onClick={() => b.set_mute(!b.get_mute())}>
                            <icon icon={bind(b, "volumeIcon")}/>
                        </eventbox>
                        
                        <slider max={1.52} hexpand drawValue valuePos={Gtk.PositionType.RIGHT}    value={bind(b, "volume").as(d => {
                            // print(d)
                            return d
                        })}
                        onDragged={({value}) => {
                            b.set_volume(value)
                        }}
                        />
                    </box>
                    {/* <box /> */}
                {(source == "speaker")?
                <centerbox>
                    <box />
                    <box css={"min-width: 15px"}>
                        <button  onClick={() => b.set_is_default(true)} >
                            <icon icon={bind(b, "is_default").as(d => d? "head_on":"head_off")}/>
                        </button>

                    </box>
                    <box />
                </centerbox>
                
                :undefined}
                {(source == "microphone")? 
                <centerbox>
                    <box />
                    <box css={"min-width: 15px"}>
                        <button  onClick={() => b.set_is_default(true)} >
                            <icon icon={bind(b, "is_default").as(d => d? "mic_on":"mic_off")}/>
                        </button>

                    </box>
                    <box />

                </centerbox>
                
                :undefined}
                {/* </centerbox> */}

            </box>

    )
}



function PlaybackMixContainer(source: string, name: string) {
    return (
        <scrollable  
        name={name}
        marginTop={15}
        marginBottom={25}
        marginLeft={25}
        marginRight={25}
        // vexpand
        hexpand                                
        halign={Gtk.Align.START}
        //  hscroll={Gtk.PolicyType.ALWAYS}
        css={"min-width: 350px; min-height: 250px"}
        //  child={bind(selected)}
        >
            <box
                
                spacing={35}
                vertical
                // css={"min-height: 200px"}
                marginBottom={20}
                marginTop={25}
                marginLeft={10}
                marginRight={10}
                setup={self => {
                    function onAdded(a:any,b:Wp.Endpoint) {
                        let w = MixSlide(b, source)
                        widgets[b.get_id()] = w
                        self.add(w)
                        
                        
                    }
                    function onRemoved(a: any, b:any) {
                        self.remove(widgets[b?.get_id()])
                        delete widgets[b?.get_id()]
                    }
                    self.hook(wp!.audio, `${source}-added`, onAdded)
                    self.hook(wp!.audio, `${source}-removed`, onRemoved)
                }}


                >
                <label label={"Empty"} visible={bind(wp!.audio, `${source}s` as keyof Wp.Audio).as(a => (a as Array<object>).length == 0)}/>
            </box>
        </scrollable>
    )
}


export function MixerWindow() {
    return (
        <window name="mixer_window"
                className="component-box"
                
                monitor={0}
                exclusivity={Astal.Exclusivity.EXCLUSIVE}
                anchor={Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.RIGHT}
                application={App}
                marginRight={10}
                marginTop={5}
                visible={false}
                
                >
                <eventbox onHoverLost={()=> App.toggle_window("mixer_window")}>
                    <box className={"mixer-window"} vertical>
                        {/* <box css={"min-height: 50px"}/> */}
                        {/* <scrollable  
                                                                marginTop={15}
                                                                marginBottom={25}
                                                                marginLeft={25}
                                                                marginRight={25}
                                    // vexpand
                                    hexpand                                
                                    halign={Gtk.Align.START}
                                    //  hscroll={Gtk.PolicyType.ALWAYS}
                                    css={"min-width: 350px; min-height: 200px"}
                                    //  child={bind(selected)}
                                    > */}
                            <stack shown={bind(prev)} transitionType={Gtk.StackTransitionType.CROSSFADE}>

                                {PlaybackMixContainer("stream", "Playback")}
                                {PlaybackMixContainer("recorder", "Recording")}
                                {PlaybackMixContainer("speaker", "Output Devices")}
                                {PlaybackMixContainer("microphone", "Input Devices")}
                                {/* <switch actionName={"asd"}></switch> */}
                            </stack>
                        {/* </scrollable> */}

                        {/* <box css={"min-height: 50px"}/> */}
                        <Options />
                    </box>

                </eventbox>
        </window>
    )
}