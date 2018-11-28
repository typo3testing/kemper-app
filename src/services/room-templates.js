import ne_diagonal from "../../assets/images/icons/room-templates/ne_diagonal.svg";
import ne_l_shape from "../../assets/images/icons/room-templates/ne_l_shape.svg";
import nw_l_shape from "../../assets/images/icons/room-templates/nw_l_shape.svg";
import nw_diagonal from "../../assets/images/icons/room-templates/nw_diagonal.svg";
import se_diagonal from "../../assets/images/icons/room-templates/se_diagonal.svg";
import se_l_shape from "../../assets/images/icons/room-templates/se_l_shape.svg";
import square from "../../assets/images/icons/room-templates/square.svg";
import sw_diagonal from "../../assets/images/icons/room-templates/sw_diagonal.svg";
import sw_l_shape from "../../assets/images/icons/room-templates/sw_l_shape.svg";

export default [
  {
    name: "Square",
    imageUrl: square,
    type: "room",
    state: {
      controlPoints: {
        a: {
          id: "a",
          x: -300,
          y: -300
        },
        b: {
          id: "b",
          x: 300,
          y: -300
        },
        c: {
          id: "c",
          x: 300,
          y: 300
        },
        d: {
          id: "d",
          x: -300,
          y: 300
        }
      },
      walls: {
        l6pic8nq6adjmssj: {
          points: ["a", "b"],
          objects: [
            {
              id: "#",
              type: "wall",
              model: null,
              length: 600
            }
          ]
        },
        z0dp7dzelic0gok8: {
          points: ["b", "c"],
          objects: [
            {
              id: "#",
              type: "wall",
              model: null,
              length: 600
            }
          ]
        },
        ol7350gd0j1hq1cu: {
          points: ["c", "d"],
          objects: [
            {
              id: "#",
              type: "wall",
              model: null,
              length: 600
            }
          ]
        },
        scvw6wnaoy1lnhy8: {
          points: ["d", "a"],
          objects: [
            {
              id: "#",
              type: "wall",
              model: null,
              length: 600
            }
          ]
        }
      },
      rooms: {
        "2j9eqogdikqqz3n9": {
          points: ["a", "b", "c", "d"]
        }
      }
    }
  },
  {
    name: "DiagonalWallTopLeft",
    imageUrl: nw_diagonal,
    type: "room",
    state: {
      controlPoints: {
        a: { id: "a", x: 400, y: -400 },
        b: { id: "b", x: 0, y: -400 },
        c: { id: "c", x: -400, y: 0 },
        d: { id: "d", x: -400, y: 400 },
        e: { id: "e", x: 400, y: 400 }
      },
      walls: {
        axkw7pl47dis72no: {
          points: ["a", "b"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        oaq31ji62i4h5e1e: {
          points: ["b", "c"],
          objects: [
            { id: "#", type: "wall", model: null, length: 565.685424949238 }
          ]
        },
        u6sh9804qpj3lmuw: {
          points: ["c", "d"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        ik7zpckb5ggfkno5: {
          points: ["d", "e"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        },
        r1706jcdgh6f0l3t: {
          points: ["e", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        }
      },
      rooms: { qszuwwa8r8xgenpg: { points: ["a", "e", "d", "c", "b"] } }
    }
  },
  {
    name: "DiagonalWallTopRight",
    imageUrl: ne_diagonal,
    type: "room",
    state: {
      controlPoints: {
        a: { id: "a", x: -400, y: -400 },
        b: { id: "b", x: 400, y: 0 },
        c: { id: "c", x: 400, y: 400 },
        d: { id: "d", x: -400, y: 400 },
        g: { id: "g", x: 0, y: -400 }
      },
      walls: {
        z8ku886h7ixso5gs: {
          points: ["b", "c"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        q6urljhhnwmhap27: {
          points: ["c", "d"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        },
        tl6hiwb4w0tf081e: {
          points: ["d", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        },
        ypaol7s11odkkn1d: {
          points: ["a", "g"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        "9li6vjd3cmvjd0ua": {
          points: ["g", "b"],
          objects: [
            { id: "#", type: "wall", model: null, length: 565.685424949238 }
          ]
        }
      },
      rooms: {
        plix3ee5et3tiyg9: {
          points: ["a", "g", "b", "c", "d"]
        }
      }
    }
  },
  {
    name: "DiagonalWallBottomLeft",
    imageUrl: sw_diagonal,
    type: "room",
    state: {
      controlPoints: {
        b: { id: "b", x: 400, y: 400 },
        c: { id: "c", x: 0, y: 400 },
        d: { id: "d", x: -400, y: 0 },
        a: { id: "a", x: -400, y: -400 },
        g: { id: "g", x: 400, y: -400 }
      },
      walls: {
        z8ku886h7ixso5gs: {
          points: ["b", "c"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        q6urljhhnwmhap27: {
          points: ["c", "d"],
          objects: [
            { id: "#", type: "wall", model: null, length: 565.685424949238 }
          ]
        },
        tl6hiwb4w0tf081e: {
          points: ["d", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        ypaol7s11odkkn1d: {
          points: ["a", "g"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        },
        "9li6vjd3cmvjd0ua": {
          points: ["g", "b"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        }
      },
      rooms: { jf9mcz177vpt7ion: { points: ["a", "g", "b", "c", "d"] } }
    }
  },
  {
    name: "DiagonalWallBottomRight",
    imageUrl: se_diagonal,
    type: "room",
    state: {
      controlPoints: {
        b: { id: "b", x: 400, y: 0 },
        c: { id: "c", x: 0, y: 400 },
        d: { id: "d", x: -400, y: 400 },
        a: { id: "a", x: -400, y: -400 },
        g: { id: "g", x: 400, y: -400 }
      },
      walls: {
        z8ku886h7ixso5gs: {
          points: ["b", "c"],
          objects: [
            { id: "#", type: "wall", model: null, length: 565.685424949238 }
          ]
        },
        q6urljhhnwmhap27: {
          points: ["c", "d"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        tl6hiwb4w0tf081e: {
          points: ["d", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        },
        ypaol7s11odkkn1d: {
          points: ["a", "g"],
          objects: [{ id: "#", type: "wall", model: null, length: 800 }]
        },
        "9li6vjd3cmvjd0ua": {
          points: ["g", "b"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        }
      },
      rooms: { jf9mcz177vpt7ion: { points: ["a", "g", "b", "c", "d"] } }
    }
  },
  {
    name: "CornerTopLeft",
    imageUrl: nw_l_shape,
    type: "room",
    state: {
      controlPoints: {
        b: { id: "b", x: 300, y: 300 },
        c: { id: "c", x: -400, y: 300 },
        d: { id: "d", x: -400, y: -100 },
        a: { id: "a", x: -100, y: -100 },
        g: { id: "g", x: -100, y: -400 },
        i: { id: "i", x: 300, y: -400 }
      },
      walls: {
        z8ku886h7ixso5gs: {
          points: ["b", "c"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        },
        q6urljhhnwmhap27: {
          points: ["c", "d"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        tl6hiwb4w0tf081e: {
          points: ["d", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        },
        ypaol7s11odkkn1d: {
          points: ["a", "g"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        },
        "096px7snplmsh5i4": {
          points: ["g", "i"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        i6233e0gha8bbwq0: {
          points: ["i", "b"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        }
      },
      rooms: {
        eser0ov0634d9i2k: {
          points: ["a", "g", "i", "b", "c", "d"]
        }
      }
    }
  },
  {
    name: "CornerTopRight",
    imageUrl: ne_l_shape,
    type: "room",
    state: {
      controlPoints: {
        a: { id: "a", x: -300, y: -400 },
        b: { id: "b", x: 400, y: -100 },
        c: { id: "c", x: 400, y: 300 },
        d: { id: "d", x: -300, y: 300 },
        g: { id: "g", x: 100, y: -400 },
        i: { id: "i", x: 100, y: -100 }
      },
      walls: {
        z8ku886h7ixso5gs: {
          points: ["b", "c"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        q6urljhhnwmhap27: {
          points: ["c", "d"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        },
        tl6hiwb4w0tf081e: {
          points: ["d", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        },
        ypaol7s11odkkn1d: {
          points: ["a", "g"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        "096px7snplmsh5i4": {
          points: ["g", "i"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        },
        i6233e0gha8bbwq0: {
          points: ["i", "b"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        }
      },
      rooms: {
        plix3ee5et3tiyg9: {
          points: ["g", "i", "b", "c", "d", "a"]
        }
      }
    }
  },
  {
    name: "CornerBottomLeft",
    imageUrl: sw_l_shape,
    type: "room",
    state: {
      controlPoints: {
        b: { id: "b", x: 300, y: 400 },
        c: { id: "c", x: -100, y: 400 },
        d: { id: "d", x: -100, y: 100 },
        a: { id: "a", x: -400, y: 100 },
        g: { id: "g", x: -400, y: -300 },
        i: { id: "i", x: 300, y: -300 }
      },
      walls: {
        z8ku886h7ixso5gs: {
          points: ["b", "c"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        q6urljhhnwmhap27: {
          points: ["c", "d"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        },
        tl6hiwb4w0tf081e: {
          points: ["d", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        },
        ypaol7s11odkkn1d: {
          points: ["a", "g"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        "096px7snplmsh5i4": {
          points: ["g", "i"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        },
        i6233e0gha8bbwq0: {
          points: ["i", "b"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        }
      },
      rooms: {
        eser0ov0634d9i2k: {
          points: ["a", "g", "i", "b", "c", "d"]
        }
      }
    }
  },
  {
    name: "CornerBottomRight",
    imageUrl: se_l_shape,
    type: "room",
    state: {
      controlPoints: {
        b: { id: "b", x: 400, y: 100 },
        c: { id: "c", x: 100, y: 100 },
        d: { id: "d", x: 100, y: 400 },
        a: { id: "a", x: -300, y: 400 },
        g: { id: "g", x: -300, y: -300 },
        i: { id: "i", x: 400, y: -300 }
      },
      walls: {
        z8ku886h7ixso5gs: {
          points: ["b", "c"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        },
        q6urljhhnwmhap27: {
          points: ["c", "d"],
          objects: [{ id: "#", type: "wall", model: null, length: 300 }]
        },
        tl6hiwb4w0tf081e: {
          points: ["d", "a"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        },
        ypaol7s11odkkn1d: {
          points: ["a", "g"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        },
        "096px7snplmsh5i4": {
          points: ["g", "i"],
          objects: [{ id: "#", type: "wall", model: null, length: 700 }]
        },
        i6233e0gha8bbwq0: {
          points: ["i", "b"],
          objects: [{ id: "#", type: "wall", model: null, length: 400 }]
        }
      },
      rooms: {
        eser0ov0634d9i2k: {
          points: ["a", "g", "i", "b", "c", "d"]
        }
      }
    }
  }
];
