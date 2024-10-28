
import Mpris from "gi://AstalMpris"
import { bind, interval, Variable } from "astal"
import { cur_icon, cur_p_status, cur_title, cur_value, current, player_stack, playtoggle } from "./MediaToggle"
import { App, Gtk, Widget } from "astal/gtk3"

const mpris = Mpris.get_default()
const players = bind(mpris, "players")

const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"
const PREV_ICON = "media-skip-backward-symbolic"
const NEXT_ICON = "media-skip-forward-symbolic"


function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}


function Player(player: Mpris.Player) {
    if (player == undefined) return <box></box>
    const Img = () => {
        return (
            <box className="img"
                 valign={Gtk.Align.START}
                 css={bind(player, "coverArt").as(p => `background-image: url('${p}');`)} />
        )
    }

    const Title = () => {
        return (
            <label className="title"
                   halign={Gtk.Align.START}
                   wrap={true}
                   label={bind(player, "title").as(t=>{
                    current.set(!current.get())
                    // let peek = player_stack.get().at(-1)
                    // // print(t)
                    // if (peek != undefined && player == peek) {
                        // cur_title.set(t)
                    // }

                    return t
                   })}/>
        )
    }

    const Artist = () => {
        return (
            <label className="artist"
                   halign={Gtk.Align.START}
                   wrap={true}
                   label={bind(player, "artist")}/>
        )
    }

    const PositionSlider = () => {
        return (
            <slider className="position"
                    drawValue={false}
                    onDragged={({value}) => {
                        let val = value * player.length
                        player.set_position(val)
                        cur_value.set(value)
                    }}
                    value={bind(player, "position").as(s => {
                        let ll = s / player.length
                        let peek = player_stack.get().at(-1)
                        if (peek != undefined && player == peek) {
                            // cur_p_status.set(player.playbackStatus)
                            // cur_title.set(player.title)
                            // cur_icon.set(player.identity)
                            cur_value.set(ll)

                        }
                        return ll
                    })}
                    setup={(self) => {
                        function update() {
                            if (player.playbackStatus == Mpris.PlaybackStatus.PLAYING)
                            {
                                const value = player.position / player.length
                                self.value = value > 0 ? value : 0
                                
                                
                            }
                            if (player == player_stack.get()[player_stack.get().length - 1]) current.set(!current.get())
                        }
                        // self.hook(player,"", update,)
                        // self.hook(player, "position",  update,)
                        // self.
                        // interval(1000, update)
                        // self.poll(1000, update)
                    }}/>
        )
    }

    const PositionLabel = () => {
        return (
            <label className="position"
                   halign={Gtk.Align.START}
                   label={bind(player, "position").as(s => {
                    // print(s)
                    return lengthStr(s)
                   })}
                   setup={self => {
                        const update = (_: Widget.Label, time: number) => {
                            if (player.playbackStatus == Mpris.PlaybackStatus.PLAYING)
                            {
                                self.label = lengthStr(time || player.position)
                                // self.visible = player.length > 0
                            }
                        }
                        // self.hook(current, update)
                        // self.hook(player,  "position", update)
                        
                        // interval(1000, update)
                        // self.poll(1000, update)
                   }}/>
        )
    }

    const LengthLabel = () => {
        return (
            <label className="length"
                   halign={Gtk.Align.END}
                   label={bind(player, "length").as(t => lengthStr(t))}/>
        )
    }

    const Icon = () => {
        return (
            <icon className="icon"
                  hexpand={true}
                  vexpand={true}
                  halign={Gtk.Align.END}
                  valign={Gtk.Align.START}
                  tooltipText={player.identity || ""}
                  icon={bind(player, "identity").as(s => {
                    if (s == undefined) {
                        return ""
                    }
                    return s
                  })}/>
        )
    }

    const PlayPause = () => {
        return (
            <button className="play-pause"
                    onClick={() => player.play_pause()}
                    visible={bind(player, "canPlay")}>
                <icon icon={bind(player, "playbackStatus").as(s => {
                    let index_p = player_stack.get().indexOf(player)
                    let peek = player
                    if (player_stack.get().length > 0) 
                    {
                        peek = player_stack.get().at(-1) || player
                        
                    }
                    // if (peek != undefined && player == peek) {
                    //     cur_p_status.set(player.playbackStatus)
                    //     // cur_value.set(ll)
                    // }
                    print("before")
                    print("===============")
                    print("stack_len:", player_stack.get().length)
                    player_stack.get().forEach(element => {
                        print(element.busName)
                    });
                    print("current: ", player.busName)
                    print("toggle", playtoggle.get())
                    print("===============")
                    print()

                    
                    switch (s) {
                        case Mpris.PlaybackStatus.PLAYING:
                            if (index_p == -1) {
                                player_stack.set([...player_stack.get(), player])
                                // current_player.set(player)
                            } else if (index_p + 1 != player_stack.get().length) {
                                let tmp = player_stack.get()
                                tmp.splice(index_p)
                                player_stack.set([...tmp, player])
                                // current_player.set(player)
                            }
                            current.set(!current.get())
                            // let peek2 = player_stack.get().at(-1)
                            // if (peek2 != undefined && player == peek2) {
                            //     cur_p_status.set(player.playbackStatus)
                            //     // cur_value.set(ll)
                            //     cur_title.set(player.title)
                            // }

                        print("after playing")
                        print("===============")
                        print("stack_len:", player_stack.get().length)
                        player_stack.get().forEach(element => {
                            print(element.busName)
                        });
                        print("current: ", player.busName)
                        print("toggle", playtoggle.get())
                        print("===============")
                        print()
                            return PAUSE_ICON
                        case Mpris.PlaybackStatus.PAUSED:
                        case Mpris.PlaybackStatus.STOPPED:
                            if (!player.can_play || (player_stack.get().length > 1 && !playtoggle.get())) {
                                let tmp = player_stack.get()
                                print("index_p: ", index_p)
                                tmp.splice(index_p, 1)
                                player_stack.set(tmp)
    
                            }
                            if ((player_stack.get().length == 0) && (!playtoggle.get()) && (mpris.get_players().length > 0)) {
                                let playing: Mpris.Player[] = []
                                let stopped = mpris.get_players().filter(p => {
                                    if (p.can_play) {
                                        if (p.playbackStatus == Mpris.PlaybackStatus.PLAYING) {
                                            playing.push(p)
                                            return false
                                        } else {
                                            return true
                                        }
                                    } else {
                                        return false
                                    }
                                })
                                player_stack.set([...stopped, ...playing])
                            }
                            // let peek3 = player_stack.get().at(-1)
                            // if (peek3 != undefined && player == peek3) {
                            //     cur_p_status.set(player.playbackStatus)
                            //     // cur_value.set(ll)
                            //     cur_title.set(player.title)
                            // }
                            playtoggle.set(false)
                            current.set(!current.get())

                            print("after stopped")
                            print("===============")
                            print("stack_len:", player_stack.get().length)
                            player_stack.get().forEach(element => {
                                print(element.busName)
                            });
                            print("current: ", player.busName)
                            print("toggle", playtoggle.get())
                            print("===============")
                            print()


                            return PLAY_ICON
                    }
                    
                        
                })}/>
            </button>
        )
    }

    const Prev = () => {
        return (
            <button onClick={() => player.previous()}
                    visible={bind(player, "canGoPrevious")}>
                <icon icon={PREV_ICON}/>
            </button>
        )
    }  
    
    const Next = () => {
        return (
            <button onClick={() => player.next()}
                    visible={bind(player, "canGoNext")}>
                <icon icon={NEXT_ICON}/>
            </button>
        )
    }  

    return (
        <box visible={bind(player, "canPlay")}
             setup={self => {
                function update(_: Widget.Box, busName: Mpris.Player) {
                    if (busName != undefined) {
                        let index_p = player_stack.get().indexOf(player)
                        let tmp = player_stack.get()
                        // print("busname:", player["bus-name"])
                        // print(busName == player["bus-name"])
                        print(">>>>>>>>>>>>")
                        print("before")
                        print("player remove")
                        print("player: ", busName.busName)
                        print("current: ", player.busName)
                        print("index_p", index_p)
                        player_stack.get().forEach(element => {
                            print(element.busName)
                        });
                        print(">>>>>>>>")
                        print()
                        if ((index_p != -1) &&(busName.busName ==player.busName)) {
                            // print("")
                            tmp.splice(index_p, 1)
                            player_stack.set(tmp)
                        }
                        print(">>>>>>>>>>>>")
                        print("after")
                        player_stack.get().forEach(element => {
                            print(element.busName)
                        });
                        print("<>>>>>>>")
                        print()
                        // print("after:", player_stack.value.length)
                        // print("mprisa_l:", mpris.players.length)
                        if ((player_stack.get().length == 0) && (mpris.get_players().length > 0) ) {
                            // let tmp3 = []
                            // mpris.players.forEach(e => {
                            //     if (e.can_play) {
                            //         print("push", e['bus-name'])
                            //         tmp3.push(e)
                            //     }
                            // });
                            let playing: Mpris.Player[] = []
                            let stopped = mpris.get_players().filter(p => {
                                if (p.can_play) {
                                    if (p.playbackStatus == Mpris.PlaybackStatus.PLAYING) {
                                        playing.push(p)
                                        return false
                                    } else {
                                        return true
                                    }
                                } else {
                                    return false
                                }
                            })
                            player_stack.set([...stopped, ...playing])
                            
                            
                        }
                        // print("lennnnnnn")
                        // print(player_stack.get().length)
                        if (player_stack.get().length == 0){
                            print("remove")
                            let w = App.get_window("media-0")
                            if (w) {
                                print("visible")
                                print(w.visible)
                                w.set_visible(false)
                                print(w.visible)
                                // w.close()
                                // App.remove_window(w)
                                // if (w.visible) App.toggle_window("media-0")
                                // App.toggle_window("media-0")
                            }
                            // App.remove_window(App.get_window("media-0")!)
                        }
                        current.set(!current.get())
 
                        // print(player_stack.value.length)
                        // current.value = !current.value

                    }
                }
                self.hook(mpris, "player-closed", update)
             }}
             className="player">
                <Img />
                <box vertical={true}
                     hexpand={true}
                     spacing={5}>
                    <box spacing={5}>
                        <Title />
                        <Icon />
                    </box>
                    <Artist />
                    <PositionSlider />
                    <box vexpand={true}/>
                    <centerbox>
                        <PositionLabel />
                        <box>
                            <Prev />
                            <PlayPause />
                            <Next />
                        </box>
                        <LengthLabel />
                    </centerbox>
                </box>

        </box>
    )

}


export default function Media() {

    return (
        <box vertical={true}
             css="min-height: 2px; min-width: 2px;"
             visible={players.as(p => p.length > 0)}
             >
            {
                players.as(p => {
                    print(p)
                    return p.map(Player)
                })
            }
        </box>
    )
}