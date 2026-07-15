"""Render the TDC fiber-Denmark card thumbnail from real Odense streets.

Fetches the drive network around Odense city centre from OpenStreetMap
via OSMnx (v2 API), then draws the retro fiber schematic on it:
premises -> fiber cabinets -> central node along actual streets.
The fetched extent matches the card's 16:9 shape, and premises are
sampled in a 140-450 m network-distance band from their cabinet so the
cyan drop routes are clearly visible.

Usage (from repo root, needs internet):
    python tools/make_tdc_thumb.py

Writes assets/projects/tdc-fiber-denmark/thumb.png (exactly 1200x675).
"""
import math
import random
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import networkx as nx
import osmnx as ox

BG, ROAD, PANEL = "#0d0f1a", "#2a3050", "#151827"
CYAN, MAGENTA, AMBER, MUTED = "#2de2e6", "#ff3864", "#f9c80e", "#9aa0b8"

CENTER = (55.3959, 10.3883)   # Odense city centre (approx)
HALF_H_M = 1000               # half-height of the map extent, metres
N_CABINETS = 8
PREMISES_PER_CABINET = 7
MIN_DROP_M, MAX_DROP_M = 140, 450   # premises distance band from cabinet
SEED = 42

FIG_W, FIG_H = 12, 6.75       # inches at dpi=100 -> 1200x675
AX_RECT = [0.02, 0.095, 0.96, 0.775]  # map area inside the figure

random.seed(SEED)

# ---- bbox matched to the axes' aspect ratio, in metres ----
ax_ratio = (AX_RECT[2] * FIG_W) / (AX_RECT[3] * FIG_H)
half_w_m = HALF_H_M * ax_ratio
lat, lng = CENTER
dlat = HALF_H_M / 111320.0
dlng = half_w_m / (111320.0 * math.cos(math.radians(lat)))
west, east = lng - dlng, lng + dlng
south, north = lat - dlat, lat + dlat

print(f"Fetching Odense drive network (~{2*half_w_m/1000:.1f} x {2*HALF_H_M/1000:.1f} km)...")
G = ox.graph_from_bbox(bbox=(west, south, east, north), network_type="drive")
G = G.to_undirected()
print(f"Graph: {len(G.nodes)} nodes, {len(G.edges)} edges")

fig = plt.figure(figsize=(FIG_W, FIG_H), dpi=100)
fig.patch.set_facecolor(BG)
ax = fig.add_axes(AX_RECT)
ax.set_facecolor(BG)

def pos(n):
    return (G.nodes[n]["x"], G.nodes[n]["y"])

def best_edge(a, b):
    return min(G.get_edge_data(a, b).values(), key=lambda d: d.get("length", 0))

def edge_xy(a, b, data):
    if "geometry" in data:
        xs, ys = data["geometry"].xy
        return list(xs), list(ys)
    return [G.nodes[a]["x"], G.nodes[b]["x"]], [G.nodes[a]["y"], G.nodes[b]["y"]]

for u, v, data in G.edges(data=True):
    xs, ys = edge_xy(u, v, data)
    ax.plot(xs, ys, color=ROAD, linewidth=1.1, solid_capstyle="round", zorder=1)

def draw_route(path, color, lw, alpha, z):
    for a, b in zip(path[:-1], path[1:]):
        xs, ys = edge_xy(a, b, best_edge(a, b))
        ax.plot(xs, ys, color=color, linewidth=lw, alpha=alpha,
                solid_capstyle="round", zorder=z)

central = ox.distance.nearest_nodes(G, lng, lat)

nodes = list(G.nodes)
cabinets = [central]
for _ in range(N_CABINETS):
    best = max(nodes, key=lambda n: min(math.dist(pos(n), pos(c)) for c in cabinets))
    cabinets.append(best)
cabinets = cabinets[1:]

for cab in cabinets:
    try:
        draw_route(nx.shortest_path(G, cab, central, weight="length"),
                   MAGENTA, 1.8, 0.85, 3)
    except nx.NetworkXNoPath:
        print(f"No trunk path for cabinet {cab}; skipped")

for cab in cabinets:
    reach = nx.single_source_dijkstra_path_length(G, cab, cutoff=MAX_DROP_M,
                                                  weight="length")
    candidates = [n for n, d in reach.items()
                  if d >= MIN_DROP_M and n != cab and n not in cabinets]
    for n in random.sample(candidates, min(PREMISES_PER_CABINET, len(candidates))):
        try:
            draw_route(nx.shortest_path(G, n, cab, weight="length"),
                       CYAN, 0.75, 0.5, 2)
        except nx.NetworkXNoPath:
            continue
        ax.plot(*pos(n), marker="s", markersize=4.2, color=CYAN, zorder=4)

for cab in cabinets:
    ax.plot(*pos(cab), marker="D", markersize=9, color=MAGENTA,
            markeredgecolor=BG, markeredgewidth=1.2, zorder=5)
ax.plot(*pos(central), marker="p", markersize=24, color=AMBER,
        markeredgecolor=BG, markeredgewidth=1.2, zorder=6)

ax.plot([], [], marker="s", linestyle="", color=CYAN, label="premises")
ax.plot([], [], marker="D", linestyle="", color=MAGENTA, label="fiber cabinet")
ax.plot([], [], marker="p", linestyle="", markersize=12, color=AMBER, label="central node")
ax.legend(loc="lower right", frameon=True, fontsize=8,
          labelcolor=MUTED, facecolor=PANEL, edgecolor="#232840")

ax.set_xlim(west, east)
ax.set_ylim(south, north)
ax.set_aspect("auto")   # bbox is metre-matched to the axes shape
ax.axis("off")
ax.set_title("FIBER ROLLOUT NETWORK  //  ODENSE, DK", loc="left",
             fontfamily="monospace", fontsize=13, color=CYAN, pad=10)
ax.text(0.0, -0.075, "ILLUSTRATIVE \u2014 NOT PROJECT OUTPUT (NDA)",
        transform=ax.transAxes, fontfamily="monospace", fontsize=8, color=AMBER)
ax.text(1.0, -0.075, "Road data \u00a9 OpenStreetMap contributors",
        transform=ax.transAxes, fontfamily="monospace", fontsize=7,
        color=MUTED, ha="right")

out = Path("assets/projects/tdc-fiber-denmark")
out.mkdir(parents=True, exist_ok=True)
fig.savefig(out / "full.png", facecolor=BG)
print(f"Wrote {out / 'full.png'} (1600x1600)")