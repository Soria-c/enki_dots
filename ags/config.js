const hyprland = await Service.import("hyprland")
// const notifications = await Service.import("notifications")
const mpris = await Service.import("mpris")
const audio = await Service.import("audio")
// const battery = await Service.import("battery")
const systemtray = await Service.import("systemtray")
App.addIcons("/home/enki/enki-dots/icons")



const players = mpris.bind("players")

const FALLBACK_ICON = "audio-x-generic-symbolic"
const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"


const playtoggle = Variable(false)
const player_stack = Variable([{}])
const current = Variable(false)
let players_stack = {}


// Utils.execAsync(["cava"])
//     .then(out => print(out))
//     .catch(err => print(err));

/** @param {number} length */
function lengthStr(length) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

// Utils.derive([player_stack], (a,b,c) =>{
//     print("asdasd")
//     print(a)
//     print(player_stack.value.length)
// })


// peek.value = undefined
player_stack.value = []
function Player(player) {

    if (player == undefined) return Widget.Box()
    const img = Widget.Box({
        class_name: "img",
        vpack: "start",
        css: player.bind("cover_path").transform(p => `
            background-image: url('${p}');
        `),
        
        // setup: self => {
        //     function update(a) {
        //         print(a)
        //         if (a != "") {
        //             return `background-image: url('${a}');`
        //         } else {
        //             return self.css
        //         }
        //     }
        //     self.bind("css", player, "cover_path", update)
        // }
    })
    const title = Widget.Label({
        class_name: "title",
        wrap: true,
        hpack: "start",
        label: player.bind("track_title"),

        // setup: self => {
        //     function update(a) {
        //         if (a != "") {
        //             return a
        //         } else {
        //             return self.label
        //         }
        //     }
        //     self.bind("label", player, "track_title", update)
        // }
    })
    const artist = Widget.Label({
        class_name: "artist",
        wrap: true,
        hpack: "start",
        label: player.bind("track_artists").transform(a => a.join(", ")),
        // setup: self => {
        //     function update(a) {
        //         if (a != "") {
        //             return a.join(", ")
        //         } else {
        //             return self.label
        //         }
        //     }
        //     self.bind("label", player, "track_artists", update)
        // }
    })

    const positionSlider = Widget.Slider({
        class_name: "position",
        draw_value: false,
        
        on_change: ({ value }) => {
            player.position = value * player.length
            
        },
        // visible: player.bind("length").as(l => l > 0),
        setup: self => {
            function update() {
                if (player.play_back_status == "Playing")
                {
                    const value = player.position / player.length
                    self.value = value > 0 ? value : 0
                    
                }
                // current.value = player_stack.value[player_stack.value.length - 1]
                if (player == player_stack.value[player_stack.value.length - 1]) current.value = !current.value
                // player_stack.value = [...player_stack.value]
            }
            self.hook(player, update)
            self.hook(player, update, "position")
            
            self.poll(1000, update)
        },
    })

    const positionLabel = Widget.Label({
        class_name: "position",
        hpack: "start",
        setup: self => {
            const update = (_, time) => {
                if (player.play_back_status == "Playing")
                {
                    self.label = lengthStr(time || player.position)
                    // self.visible = player.length > 0
                }
            }
            // self.hook(current, update)
            self.hook(player, update, "position")
            self.poll(1000, update)
        },
    })

    const lengthLabel = Widget.Label({
        class_name: "length",
        hpack: "end",
        // visible: player.bind("length").transform(l => l > 0),
        label: player.bind("length").transform((t)=>{
            // print("length label")
            // print(t)
            // let tt = lengthStr(t)
            // print(tt)
            return lengthStr(t)
        }),
        // setup: self => {
        //     function update() {
        //         // print("update")
        //         // print(lengthStr(player.length))
        //         self.label = lengthStr(player.length)
        //     }
        //     self.poll(1000, update)
        // }
    })

    const icon = Widget.Icon({
        class_name: "icon",
        hexpand: true,
        vexpand: true,
        hpack: "end",
        vpack: "start",
        tooltip_text: player.identity || "",
        // icon: player.bind("entry").transform(entry => {
        //     const name = `${entry}-symbolic`
        //     return Utils.lookUpIcon(name) ? name : FALLBACK_ICON
        // }),
        icon: player.bind("name")
    })

    const playPause = Widget.Button({
        class_name: "play-pause",
        on_clicked: () => player.playPause(),
        visible: player.bind("can_play"),
        child: Widget.Icon({
            icon: player.bind("play_back_status").transform(s => {
                let index_p = player_stack.value.indexOf(player)
                let peek = player
                if (player_stack.value.length > 0) 
                {
                    peek = player_stack.value.at(-1)
                    
                }
                // if (index_p == -1) {
                //     player_stack.value = [...player_stack.value, player]
                // } else if (index_p + 1 != player_stack.value.length) {
                //     let tmp = player_stack.value
                //     tmp.splice(index_p)
                //     player_stack.value = [...tmp, player]
                // }
                // if (!player.can_play) {
                //     let tmp = player_stack.value

                //     tmp.splice(index_p, 1)
                //     player_stack.value = tmp
                //     current.value = !current.value
          
                //     return ""
                // }
                switch (s) {
                    case "Playing":
                        if (index_p == -1) {
                            player_stack.value = [...player_stack.value, player]
                        } else if (index_p + 1 != player_stack.value.length) {
                            let tmp = player_stack.value
                            tmp.splice(index_p)
                            player_stack.value = [...tmp, player]
                        }
                        // MediaWidgetPeek.value = MediaToggle2(player_stack.value.at(-1))

                        return PAUSE_ICON
                    case "Paused":
                    case "Stopped":
                        print("stoopped")
                        // print(player.can_play)
                        print(player["bus-name"])
                        print(player_stack.value.length )
                        print(player_stack.value.length > 1)
                        print(!playtoggle.value)
                        print(player.can_play)
                        if (!player.can_play || (player_stack.value.length > 1 && !playtoggle.value)) {
                            print("asdasd")
                            let tmp = player_stack.value

                            tmp.splice(index_p, 1)
                            player_stack.value = tmp

                        }
                        if ((player_stack.value.length == 0) && (!playtoggle.value) && (mpris.players.length > 0)) {
                            let tmp3 = []
                            mpris.players.forEach(e => {
                                if (e.can_play) {

                                    tmp3.push(e)
                                }
                            });
                            player_stack.value = tmp3
                        }
                        print("after")
                        print(player_stack.value.length )
                        // else if (player_stack.value.length  == 1 && !playtoggle.value) {

                        // }
                        playtoggle.value = false
                        // current.value = player_stack.value[player_stack.value.length - 1]
                        current.value = !current.value
                        
                        
                        // MediaWidgetPeek.value = MediaToggle2(player_stack.value.at(-1))
                        return PLAY_ICON
                }
                
            }),
        }),
    })

    const prev = Widget.Button({
        on_clicked: () => player.previous(),
        visible: player.bind("can_go_prev"),
        child: Widget.Icon(PREV_ICON),
    })

    const next = Widget.Button({
        on_clicked: () => player.next(),
        visible: player.bind("can_go_next"),
        child: Widget.Icon(NEXT_ICON),
    })
    
    return Widget.Box(
        
        { 
            visible: player.bind("can_play"),
            setup: self => {
                function update(_, busName) {
                    if (busName != undefined) {
                        print("player closed")
                        print("closed busname:", busName)
                        print("cna_play:", player.can_play)
                        print("stack_l:", player_stack.value.length)
                        print("player_l:", mpris.players.length)
                        let index_p = player_stack.value.indexOf(player)
                        print(index_p)
                        let tmp = player_stack.value
                        print(index_p != -1)
                        print("busname:", player["bus-name"])
                        print(busName == player["bus-name"])
                        
                        if ((index_p != -1) && (busName ==player["bus-name"])) {
                            print("in")
                            tmp.splice(index_p, 1)
                            player_stack.value = tmp
                        }
                        print("after:", player_stack.value.length)
                        print("mprisa_l:", mpris.players.length)
                        if ((player_stack.value.length == 0) && (mpris.players.length > 0)) {
                            let tmp3 = []
                            mpris.players.forEach(e => {
                                if (e.can_play) {
                                    print("push", e['bus-name'])
                                    tmp3.push(e)
                                }
                            });
                            print("after22:", player_stack.value.length)
                            print("tmpafter22:", tmp.length)
                            player_stack.value = tmp3
                            
                            
                        }
                        current.value = !current.value
                        print("\n")
                        print("after444:", player_stack.value.length)
                        if (player_stack.value.length == 0) App.closeWindow("media-0")
                        // print(player_stack.value.length)
                        // current.value = !current.value

                    }
                }
                self.hook(mpris, update, "player-closed")
            },
            // setup: self => {
            //     function update() {
            //         print("changed")
            //         print(!player.can_play)
            //         print()
            //         if (!player.can_play) {
            //             let index_p = player_stack.value.indexOf(player)
            //             let tmp = player_stack.value
    
            //             tmp.splice(index_p, 1)
            //             player_stack.value = tmp
            //             current.value = !current.value
              
            //             // return ""
            //         }
            //     }
            //     // player.connect("changed", update)
            // },
            class_name: "player",
            children: [
                img,
                Widget.Box(
                    {
                        vertical: true,
                        hexpand: true,
                        spacing: 5
                    },
                    Widget.Box({
                        spacing: 5,
                        children: [
                            title,
              
                            icon,
                        ]
                    }),
                    artist,
                    Widget.Box({ vexpand: true }),
                    positionSlider,
                    Widget.CenterBox({
                        start_widget: positionLabel,
                        center_widget: Widget.Box([
                            prev,
                            playPause,
                            next,
                        ]),
                        end_widget: lengthLabel,
                    }),
                ),
            ]
        
        },
        

    )
}



export function Media() {
    
    return Widget.Box({
        vertical: true,
        css: "min-height: 2px; min-width: 2px;", // small hack to make it visible
        // setup: self => {
        //     function update() {
        //         print("update")
        //         print(player_stack.value.length)
        //         print(player_stack.value.length > 0)
        //         print("\n")
        //         self.visible = player_stack.value.length > 0
        //     }
        //     self.hook(current, update)
        // },
        visible: players.as(p => {
            // print("media visible")
            // print(p.length)
            return p.length > 0
        }),

        children: players.as(p => {
            // print(p)
            return p.map(pp => {
                return Player(pp)
            })
        }),
        // visible: media_widgets.bind().as(p => {
        //     return p.length > 0
        // }),
        // children: 
        // media_widgets.bind(),
        // setup: self => {
        //     function onPlayerClosed(_, busName) {
        //         print("player closed")
        //         if (busName !== undefined) {
        //             if (active_players[busName]) {
        //                 let tmp = player_stack.value
        //                 let tmp2 = media_widgets.value
        //                 tmp.splice(loaded_players[busName].index, 1)
        //                 tmp2.splice(loaded_players[busName].index, 1)[0]?.destroy()
        //                 player_stack.value = tmp
        //                 media_widgets.value
        //             }
        //             // self.children = tmp2
        //             delete loaded_players[busName]
        //             delete active_players[busName]
        //         }
        //     }
        //     function onPlayerAdded(_, busName) {
        //         print("player addedd")
        //         if (busName != undefined && !(busName in loaded_players)) {
        //             let player =  mpris.getPlayer(busName)
        //             if (player !== null) {
        //                 player.connect("changed", (p)=> {
        //                     // print("connect")
        //                     // print(p["bus-name"])
        //                     // print(p.can_play)
        //                     // print(active_players[busName])
        //                     // print("\n")
                            
        //                     if (!p.can_play && active_players[busName]) {
                                
        //                         let tmp2 = media_widgets.value
        //                         print("destroy")
        //                         print(player.play_back_status)
        //                         print(player.shuffle_status)
        //                         for (const prop in player["metadata"]) {
        //                             console.log(`${prop}: ${player["metadata"][prop]}`);
        //                           }
        //                         // print(player["bus-name"])
        //                         // print(tmp2)
        //                         // print(tmp2.length)
                                
        //                         tmp2.splice(loaded_players[busName].index, 1)[0].destroy()
        //                         // tmp2.splice(loaded_players[busName].index, 1)[0]
        //                         // print("tmp2")
        //                         // print(tmp2)
        //                         // print(tmp2.length)
        //                         // if (player_stack.value.length > 1) {
        //                         let tmp = player_stack.value
        //                         tmp.splice(loaded_players[busName].index, 1)
        //                         player_stack.value = tmp
        //                         // }
        //                         media_widgets.value = tmp2
        //                         active_players[busName] = false
        //                         current.value = !current.value
        //                     } else if (p.can_play && !active_players[busName]) {

        //                         loaded_players[busName].index = player_stack.value.length
        //                         active_players[busName] = true
        //                         player_stack.value = [...player_stack.value, loaded_players[busName].player]
        //                         // self.children = [...self.children, Player(player)]
        //                         media_widgets.value = [...media_widgets.value, Player(loaded_players[busName].player)]
        //                         current.value = !current.value

        //                     }
        //                 })
        //                 loaded_players[busName] = {
        //                     player,
        //                     index: player_stack.value.length
        //                 }
        //                 active_players[busName] = true
        //                 player_stack.value = [...player_stack.value, player]
        //                 // self.children = [...self.children, Player(player)]
        //                 media_widgets.value = [...media_widgets.value, Player(player)]
        //             }
        //         }
        //     }
        //     self.hook(mpris, onPlayerClosed, "player-closed")
        //     self.hook(mpris, onPlayerAdded, "player-added")
            
        // }
    })
}

const calendar = Widget.Calendar({
    showDayNames: true,
    showDetails: true,
    showHeading: true,
    showWeekNumbers: true,

    onDaySelected: ({ date: [y, m, d] }) => {
        print(`${y}. ${m}. ${d}.`)
    },
})


const date = Variable("", {
    poll: [1000, 'date "+%H:%M:%S, %a %d/%m/%y "'],
})
const cpu_info = Variable("", {
    poll: [2000, "sensors"],
})
const cpu_usage = Variable("", {
    poll: [2000, "mpstat -P ALL 1 1 -o JSON"],
})

const ram_usage = Variable("", {
    poll: [2000, "vmstat -s -S M"],
})

const gpu_info = Variable("", {
    poll: [1000, 'gpuinfo.sh'],
})


const ff = Variable(Widget.FlowBox({
    max_children_per_line: 4,
    min_children_per_line: 2,
}))

const trail_window = Widget.Window({
    name: 'trail_window',
    class_name: "component-box",
    anchor:['top', 'right'],
    setup: w => w.keybind("Escape", () => App.closeWindow('trail_window')),
    visible:false,
    
    margins: [5,151 ,0, 0],
    keymode: "on-demand",
    
    child: Widget.Box({
        child: ff.bind()
    })
    
})

let bad_clients = []

const dispatch = ws => hyprland.messageAsync(`dispatch workspace ${ws}`);

const vv = Variable(hyprland.clients)
hyprland.connect("client-added", (f,a)=> {
    print("client added")
    let cl = hyprland.getClient(a)
    if (cl != undefined ) {
        if (cl.class == "") {
            bad_clients.push(a)
        } else {
            vv.value = f.clients
        }
    }
    
})
hyprland.connect("client-removed", (f, a)=> {
    print("cleint remove")
    let cl = hyprland.getClient(a)
    if (bad_clients.includes(a)) {
        bad_clients.splice(bad_clients.indexOf(a), 1)
    } else {
        vv.value = f.clients
    }
})

// BAR 2



function Logo() {
    return Widget.Box({
        class_names: ["component-box", ""],
        child: Widget.Icon({
            class_names: ["logo-icon", ""],
            icon: "arch_logo4"
        })
    })
}
function GPU_USAGE() {
    const  gpu = gpu_info.bind()
    
    return Widget.Box({
        class_name: "gpu-box",
        children: [
            Widget.Icon({
                class_name: "",
                icon: "gpu_icon"
            }),
            Widget.Label({
                label: gpu.as(d => {
                    let usage = JSON.parse(d)
                    return "  " + usage.tmp+"°C" + " " + usage.usage +"%"
                })
            })
        ]
    })
}
function RAM_USAGE() {
    const  ram = ram_usage.bind()
    
    return Widget.Box({
        spacing: 8,
        class_name: "ram-box",
        children: [
            Widget.Icon({
                class_name: "",
                icon: "ram_memory"
            }),
            Widget.Label({
                label: ram.as(d => {
                    let usage = Number(d.split("\n")[1].split("M")[0].trim()) / 1024
                    // print()
                    return usage.toFixed(2) +"GB"
                })
            })
        ]
    })
}

function CPU_US() {
    const  cpu = cpu_usage.bind()
    
    return  Widget.Label({
                label: cpu.as(d => {
                    let usage = 100 - Number(JSON.parse(d).sysstat.hosts[0].statistics[0]["cpu-load"][0].idle)
                    return usage.toFixed(0) + "%"
                })
            })

}

function CPU_TEMP() {
    const  cpu = cpu_info.bind()

    return Widget.CenterBox({
        
        start_widget: Widget.Box({
            class_name: "value",
            child: Widget.Label({
                label: cpu.as(d => {
                    return d.split("\n")[2].split("+")[1].substring(0, 2);
                })
            })
            
        }),
        end_widget: Widget.Label("°C")
    })
}

function CPU_USAGE_() {
    return Widget.Box({
        spacing: 5,
        class_name: "cpu-box",
        children: [
            CPU_TEMP(),
            CPU_US(),
        ]
    })
}

function METRICS(){
    return Widget.Box({
        spacing: 5,
        class_name: "component-box ",
        children: [
            Widget.Icon({
                class_name: "",
                icon: "cpu_icon"
            }),
            CPU_USAGE_(),
            Widget.Separator({
                vertical: true
            }),
            RAM_USAGE(),
            GPU_USAGE()
            
        ]
    })
}

const numebers = {
    1: "\u0661",
    2: "\u0662",
    3: "\u0663",
    4: "\u0664",
    // 4: "۴",
    // 5: "\u0665",
    5: "۵",
    // 6: "\u0666",
    6: "۶",
    7: "\u0667",
    8: "\u0668",
    9: "\u0669",
    10: "\u0661\u0660",
}

hyprland.connect("workspace-added", (a,s,d)=> {
    // print("asdasdasd")
    // print(a)
    // print(s)
    // print(d)
})

const Workspaces = () => Widget.EventBox({
    
    onScrollUp: () => dispatch('+1'),
    onScrollDown: () => dispatch('-1'),
    child: Widget.Box({
        spacing: 10,
        class_names: ["component-box", "numbers"],
        children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Widget.Label({
            attribute: i,
            label: numebers[i],
            class_name: hyprland.active.workspace.bind("id").as(active => {
                // print("zzz")
                // print(i)
                if (active == i) {
                    return "focused"
                }
                else if (hyprland.clients.find(c => c.workspace.id == i) !== undefined){
                    // print("kifds")
                    return "unfocused"
                } else {
                    return "unused"
                }
            }),
        })),

        setup: self => self
                            .hook(hyprland, (a,b,c) => self.children.forEach(btn => {
                                let active = hyprland.active.workspace.id
                                // if (active != btn.attribute && hyprland.clients.find(c => c.workspace.id == btn.attribute) !== undefined){
                                if (active != btn.attribute && btn.attribute == b){
                                    btn.class_name = "unfocused"
                                } 
                            },),"workspace-added")
                            .hook(hyprland, (a,b) => self.children.forEach(btn => {
                                let active = hyprland.active.workspace.id
                                // print("ewqwqedsa")
                                // if (active != btn.attribute && hyprland.clients.find(c => c.workspace.id == btn.attribute) == undefined){
                                if (active != btn.attribute && btn.attribute == b){
                                    btn.class_name = "unused"
                                } 
                            }), "workspace-removed"),
    }),
})

function Left() {
    return Widget.Box({
       
        spacing: 10,
        children: [
            Logo(),
            METRICS(),
            Workspaces(),
        ],
    })
}


let Clients = () => {
    const activeClient = hyprland.active.client.bind('address')
    
    return Widget.Box({
            spacing: 8,
            // visible
            // visible: false,
            class_name: hyprland.bind("clients").as(p => {
                if (p.length > 0) {
                    return "component-box"
                } else {
                    return "hide-clients"
                }
            }),
            children: vv.bind().as(a => a.sort((a, b) => {
                
                if (a.workspace.id < b.workspace.id) return -1;
                if (a.workspace.id > b.workspace.id) return 1;
                return 0;  
            })
            // .filter(c => c.class != "")
            .map(i => {
                
                return Widget.EventBox({
                    onPrimaryClick: () => dispatch(i.workspace.id),
                    on_hover: (self) => {
                        if (self.class_name != "client-focused") self.class_name = "client-hover";
                    },
                    on_hover_lost: (self) => {
                        if (self.class_name != "client-focused") self.class_name = "";
                    },
                    class_name: activeClient.as(addr => `${addr === i.address ? "client-focused" : ""}`),
                    child: Widget.Icon({
                        // class_name: "client_icon",
                        icon: i.class,
                    })
                })
            }
            ))
            ,
            setup: self => self.bind("css", hyprland, "clients")
        });
} 
function Volume() {
    const icons = {
        101: "overamplified",
        67: "high",
        34: "medium",
        1: "low",
        0: "muted",
    }

    function getIcon() {
        
        const icon = audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
            threshold => threshold <= audio.speaker.volume * 100)

        return `audio-volume-${icons[icon]}-symbolic`
    }


    const icon = Widget.Icon({
        icon: Utils.watch(getIcon(), audio.speaker, getIcon),
    })
    let audio_prev_volume = audio.speaker.volume
    const audio_btn = Widget.EventBox({
        child: icon,
        onPrimaryClick: () => {
            if (audio.speaker.volume == 0)
            {
                audio.speaker.volume = audio_prev_volume
            } else {
                audio_prev_volume = audio.speaker.volume
                audio.speaker.volume = 0
                
            }
        }
    })

    const slider = Widget.Slider({
        class_name: "slider",
        hexpand: true,
        vexpand: false,
        draw_value: false,
        on_change: ({ value }) => audio.speaker.volume = value,
        setup: self => self.hook(audio.speaker, () => {
            self.value = audio.speaker.volume || 0
        }),
    })

    return Widget.Box({
        spacing: 2.5,
        class_name: "component-box",
        css: "min-width: 150px",
        children: [audio_btn, slider],
    })
}

const calendar_window = Widget.Window({
    name: 'calendar_window',
    anchor:['top', 'right'],
    setup: w => w.keybind("Escape", () => App.closeWindow('calendar_window')),
    visible:false,
    margins: [5,5 ,0, 0],
    keymode: "on-demand",
    // exclusivity: 'ignore',
    child: Widget.EventBox({
        onHoverLost:() =>{
            App.closeWindow("calendar_window");
        } ,
        child: calendar
    })
})

function Clock() {
    const d = date.bind()
    const clock_w = Widget.EventBox({
        
        onPrimaryClick: () =>{
            App.toggleWindow("calendar_window");
        },
        onHoverLost: () =>{
            App.closeWindow("calendar_window");
        },
        child:  
        Widget.CenterBox({
            class_names: ["component-box", "date"],
            // class_name: "date_box",
            centerWidget: 
                Widget.Box({
                    spacing: 2,
                    // vertical: true,
                    children: [
                        Widget.Box({
                            class_name: "clock",
                            children: [
                                Widget.Icon('clock-color-icon'),
                                Widget.Label({
                                    // class_name: "clock",
                                    label: d.as(c => " " + c.split(",")[0]),
                                }),
                        ]
                        }),
                        Widget.Box({
                            children: [
                                Widget.Icon('calendar_icon'),
                                Widget.Label({
                                    // class_name: "clock",
                                    label: d.as(c => c.split(",")[1]),
                                })
                            ]
                        })
                  
                    ]
                })
        }) 
    })
    return clock_w
}
function SysTray() {

    systemtray.connect("added", (a,b,c) => {
        let fb = Widget.FlowBox({
            homogeneous: true,
            selection_mode: 0,
            
            max_children_per_line: 4,
            min_children_per_line: 4,
            setup: self => {
                a.items.forEach((item, i) => {
            
                    self.insert(Widget.Button({
                        class_name: "trail-button",
                        child: Widget.Icon({ icon: item.bind("icon") }),
                        on_primary_click: (_, event) => item.activate(event),
                        on_secondary_click: (_, event) => item.openMenu(event),
                        tooltip_text: item.bind("title"),
                    }), i)
                    
                });
            }
        })

        ff.value = fb

    })
    
    systemtray.connect("removed", (a,b,c) => {
    
        let fb = Widget.FlowBox({
            homogeneous: true,
            selection_mode: 0,
            
            max_children_per_line: 3,
            min_children_per_line: 3,
        })
        a.items.forEach((item, i) => {
            fb.insert(Widget.Button({
                class_name: "trail-button",
                child: Widget.Icon({ icon: item.bind("icon") }),
                on_primary_click: (_, event) => item.activate(event),
                on_secondary_click: (_, event) => item.openMenu(event),
                tooltip_text: item.bind("title"),
            }), i)
            
        });
        ff.value = fb
    })
    
    let b = Widget.EventBox({
        onPrimaryClick: () => App.toggleWindow("trail_window"),
        child: Widget.Icon({
            
            icon: "down_arrow"
        }),
        tooltip_text: "more"
    })
    
    return Widget.CenterBox({
        
        class_names: ["component-box", "trail"],
        centerWidget: Widget.Box({
            spacing: 9,
            child: b
        })
    })
}



function get_play_status_icon(status) {
    switch (status) {
        case "Playing":

            return PAUSE_ICON
        case "Paused":
        case "Stopped":
            return PLAY_ICON
    }
    return ""
}

function MediaToggle2(player) {
    // if (player == null) return Widget.Box(); 
    return Widget.Box({
        setup: self => {
            function update() {
                print("len")
                print(player_stack.value.length)
                self.visible = player_stack.value.length > 0
            }
            self.hook(current, update)
        },
        // visible: player_stack.bind().as( p=> {
        //     print("len")
        //     print(p.length)
        //     return p.length >0
        // }),
        // setup: self=> {
        //     function update() {
        //         self.visible = player_stack.value.length > 0
        //     }
        //     self.hook(current, update)
        // },
        class_names: ["component-box", "media-box"],
            // visible: media_widgets.bind().as(p => {
            //     print("length")
            //     print(p.length)
            //     return p.length > 0
            // }),
            child: Widget.Box({
                spacing: 6,
                class_names: ["component-box", "media-box"],
                children: [
                    Widget.EventBox({
                        onPrimaryClick: () => {
                            playtoggle.value = true
                            player_stack.value[player_stack.value.length - 1].playPause()
                        }, 
                        child: Widget.CircularProgress({
                            setup: self => {
                                function update() {
                                    // print(player_stack.value)
                                    if (player_stack.value.length > 0) {
                                        self.value = player_stack.value[player_stack.value.length - 1].position /player_stack.value[player_stack.value.length - 1].length
                                        // self.value = current.value.position /player_stack.value[player_stack.value.length - 1].length
                                        self.child.icon = get_play_status_icon(player_stack.value[player_stack.value.length - 1]["play-back-status"])
                                    }
                                }
                                self.hook(current, update)
                            },
                            class_name: "media_cir",
                            rounded: false,
                            inverted: false,
                            startAt: 0.75,
                            // value: player_stack.value[player_stack.value.length - 1].position /player_stack.value[player_stack.value.length - 1].length,
                            // setup: self => {
                            //     function update() {
                            //         if (player.play_back_status == "Playing")
                            //         {
                            //             const value = player.position / player.length
                            //             self.value = value > 0 ? value : 0
                            //         }
                            //     }
                            //     self.hook(player, update)
                            //     self.hook(player, update, "position")
                            //     self.poll(1000, update)
                            // },
                            child: Widget.Icon({
                                css: "font-size: 10px",
                                // icon: ,
                            }),
                        }),
                    }),
                    Widget.EventBox({
                        onPrimaryClick: () => App.toggleWindow("media-0"),
                        child: Widget.Box({
                            spacing: 6,
                            children: [
                                Widget.Label({
                                    class_names: ["words"],
                                    maxWidthChars: 18,
                                    // justification: 'left',
                                    truncate: "middle",
                                    // label: player.bind("track_title"),
                                    setup: self => {
                                        self.hook(current, (s, p, c) => {
                                            // print(c)
                                            // print(player_stack.value[player_stack.value.length - 1].bind("name").transform(a => a))
                                            // self.label = player_stack.value[player_stack.value.length - 1].bind("name").transform(a => a)
                                            if (player_stack.value.length > 0) {
                                                let track_title = player_stack.value[player_stack.value.length - 1].track_title
                                                if (track_title != "")
                                                self.label = track_title
                                            }
                                        })
                                    }
            
                                }),
                                Widget.Icon({
                                    setup: self => {
                                        function update() {
                                            if (player_stack.value.length > 0) {
                                                self.icon  = player_stack.value[player_stack.value.length - 1].name
                                            }
                                        }
                                        self.hook(current, update)
                                    
                                    },
                                    // icon: : "firefox"
                                })
                            ]
                        })
                        

                    
                }),
            ]
            })
    })
}
function Right() {
    return Widget.Box({
        // onPrimaryClick: () => petina.value =Widget.Box({
        //     child: Widget.Label("petidfna loca")
        // }) ,
        hpack: "end",
        spacing: 8,
        children: [
            // Media(),
            // Widget.Box({child:MediaWidgetPeek.bind()}),
            MediaToggle2(mpris.players[0]),
            // MediaToggle(),
            // Volume(),
            SysTray(),
            Clock(),
        ],
    })
} 


function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`, 
        class_name: "bar2",
        monitor,
        
        anchor: ["top", "left", "right"],
        margins: [2, 10, 0, 10],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            
            start_widget: Left(),
            center_widget:
            // Widget.Box({
                
                // child: 
                Clients(),
            // }),
            end_widget: Right(),
        }),
    })
}

const media_window =  Widget.Window({
    class_name: "component-box",
    // class_name: "media-box",
    name: "media-0",
    monitor: 0,
    setup: w => w.keybind("Escape", () => App.closeWindow('media-0')),
    visible: false,
    anchor: ["top", "right"],
    margins: [5,220,0,0],
    child: Media()
    
})


//////////////////////////////////////////////////////




const notification_map = Variable({})



const notifications = await Service.import("notifications")
notifications.popupTimeout = 10000;
function NotificationIcon({ app_entry, app_icon, image }) {
    if (image) {
        return Widget.Box({
            css: `background-image: url("${image}");`
                + "background-size: contain;"
                + "background-repeat: no-repeat;"
                + "background-position: center;",
        })
    }

    let icon = "dialog-information-symbolic"
    if (Utils.lookUpIcon(app_icon))
        icon = app_icon

    if (app_entry && Utils.lookUpIcon(app_entry))
        icon = app_entry

    return Widget.Box({
        child: Widget.Icon(icon),
    })
}

function Notification(app_name) {
    print(app_name)
    const icon = Widget.Box({
        vpack: "start",
        class_name: "icon",
        setup: self => {
            function update() {
                self.child = NotificationIcon(notification_map.value[app_name])
            }
            self.hook(notification_map, update)
        }
    })

    const title = Widget.Label({
        class_name: "title",
        xalign: 0,
        justification: "left",
        hexpand: true,
        max_width_chars: 24,
        truncate: "end",
        wrap: true,
        use_markup: true,
        setup: self => {
            function update() {
                self.label = notification_map.value[app_name].summary
            }
            self.hook(notification_map, update)
        }
    })

    const body = Widget.Label({
        class_name: "body",
        hexpand: true,
        use_markup: true,
        xalign: 0,
        justification: "left",
        wrap: true,
        setup: self => {
            function update() {
                self.label = notification_map.value[app_name].body
            }
            self.hook(notification_map, update)
        }
    })

    const actions = Widget.Box({
        class_name: "actions",
        setup: self => {
            function update() {
                self.children = notification_map.value[app_name].actions.map(({ id, label }) => Widget.Button({
                    class_name: "action-button",
                    on_clicked: () => {
                        notification_map.value[app_name].invoke(id)
                        notification_map.value[app_name].dismiss()
                    },
                    hexpand: true,
                    child: Widget.Label(label),
                }))
            }
            self.hook(notification_map, update)
        },
        // children: ,
    })

    return Widget.EventBox(
        {
            // attribute: { id: n.id },
            // on_primary_click: n.dismiss,
            on_hover: () => clearTimeout(notification_map.value[app_name].timeout),
            on_hover_lost: () => {
                notification_map.value[app_name].widget?.destroy() 
                delete  notification_map.value[app_name]
            },
            setup: self => {
                function update() {
                    self.attribute = { id: notification_map.value[app_name].id }
                    self.on_primary_click = notification_map.value[app_name].dismiss
                }
                self.hook(notification_map, update)
            }
        },
        Widget.Box(
            {
                // class_name: `notification ${notification_map.value[app_name].urgency}`,
                vertical: true,
                setup: self => {
                    function update() {
                        self.class_name = `notification ${notification_map.value[app_name].urgency}`
                    }
                    self.hook(notification_map, update)
                }
            },
            Widget.Box(
            {           
                spacing: 8,     
               children: [
                icon,
                Widget.Box(
                    { vertical: true },
                    title,
                    body,
                    
                ),
                Widget.Icon({
                    class_name: "icon",
                    hexpand: true,
                    vexpand: true,
                    hpack: "end",
                    vpack: "start",
                    icon: app_name
                })
            ]}),
            actions,
        ),
    )
}

export function NotificationPopups(monitor = 0) {
    const list = Widget.Box({
        vertical: true,
        children: notifications.popups.map(Notification),
    })

    function onNotified(_, id) {
        const n = notifications.getNotification(id)

        if (n) {
            let not = {}
            if (!(n.app_name in notification_map.value)) {
                let not_widget = Notification(n.app_name)
                
                not = {
                    "widget": not_widget,
                }
                list.children = [ not_widget, ...list.children]
                
            } 
            notification_map.value = {...notification_map.value, 
                [n.app_name]: {
                    ...not,
                    ...notification_map.value[n.app_name],
                    "summary": n.summary,
                    "body": n.body,
                    "actions": n.actions,
                    "id": n.id,
                    "dismiss": n.dismiss,
                    "app_entry": n.app_entry,
                    "app_name": n.app_name,
                    "app_icon": n.app_icon,
                    "urgency": n.urgency,
                    "image": n.image,
                    "invoke": n.invoke,
                    
                }
            }
            if (!notification_map.value[n.app_name].widget.isHovered()) {
                clearTimeout(notification_map.value[n.app_name].timeout)
                notification_map.value[n.app_name].timeout = setTimeout(() => { 
                    notification_map.value[n.app_name].widget?.destroy() 
                    delete  notification_map.value[n.app_name]
                }, 3000)
            }
           
            
        
        }
    }

    function onDismissed(_, id) {
        // print("dismiss")
        // print(list.children.length)
        // list.children.find(n => n.attribute.id === id)?.destroy()
        // print(list.children.length)
    }

    list.hook(notifications, onNotified, "notified")
        .hook(notifications, onDismissed, "dismissed")

    return Widget.Window({
        monitor,
        name: `notifications${monitor}`,
        class_name: "notification-popups",
        // exclusivity: 'ignore',
        layer: "overlay",
        anchor: ["top", "right"],
        child: Widget.Box({
            css: "min-width: 2px; min-height: 2px;",
            class_name: "notifications",
            vertical: true,
            child: list,

            /** this is a simple one liner that could be used instead of
                hooking into the 'notified' and 'dismissed' signals.
                but its not very optimized becuase it will recreate
                the whole list everytime a notification is added or dismissed */
            // children: notifications.bind('popups')
            //     .as(popups => popups.map(Notification))
        }),
    })
}



//////////////////////////////////////////////////////////

App.config({
    style: "./styles.css",
    windows: [
        Bar(),
        calendar_window,
        trail_window,
        media_window,
        NotificationPopups()

    ],
})




Utils.monitorFile(
    `/home/enki/.config/ags`,

    function() {
        const css = `${App.configDir}/styles.css`

        // compile, reset, apply
        // Utils.exec(`sassc ${scss} ${css}`)
        App.resetCss()
        App.applyCss(css)
    },
)

export { }