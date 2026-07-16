// Single source of truth for all projects.
// Rendered by both the hero map and the project grid.
// coords are [lng, lat] (GeoJSON order). All coordinates are approximate
// study-area centroids -- verify and adjust freely.
// Image convention: assets/projects/<slug>/thumb.jpg (or .png/.webp)
// Missing images render as styled placeholders. nda: true suppresses
// images and external links and adds the NDA badge.

const PROJECTS = [
  {
    slug: "european-heatwave-2026",
    title: "Anatomy of a European Heatwave",
    years: "2026",
    category: "Remote Sensing",
    kind: "Personal",
    locationLabel: "France & Iberian Peninsula",
    // european-heatwave-2026
    markers: [[-3.0, 41.0]],
    footprints: [
        { type: "named", id: "FRA" },
        { type: "named", id: "ESP" },
        { type: "named", id: "PRT" }
    ],
    blurb: "Three-panel infographic dissecting the June 2026 heatwave over France, Spain, and Portugal: Sentinel-3 land surface temperature (23 June), soil-moisture anomaly against the 1991\u20132020 mean, and CEMS EFFIS burnt-area impacts from 15 June to 6 July, tracing the chain from ground heat and dry soils to fire impacts.",
    tech: [{ name: "Python", libs: ["Rasterio", "Xarray"] }, "QGIS"],
    data: ["Sentinel-3 LST", "Copernicus C3S soil moisture", "CEMS EFFIS"],
    links: [],
    nda: false,
    details: "A personal exercise in the style of the Copernicus Image of the Day infographics: pulling multiple Copernicus sources into one readable visual story. The three panels trace a causal chain through the June 2026 heatwave, from Sentinel-3 land surface temperature, through the C3S soil moisture anomaly against the 1991\u20132020 baseline, to the EFFIS burnt-area record, showing how surface heat and depleted soils set the stage for the fire impacts that followed.",
    full: "assets/projects/european-heatwave-2026/full.png",
    fullCaption: "Anatomy of a European Heatwave",
  },
  {
    slug: "wyvern-hyperspectral",
    title: "Hyperspectral Pipelines on Wyvern Dragonette Open Data",
    years: "2025\u20132026",
    category: "Hyperspectral / ML",
    kind: "Personal",
    locationLabel: "Santa Cruz de la Sierra, Bolivia & Bitter Lake, Egypt",
    markers: [[-62.289, -17.700], [32.517, 30.247]],
    footprints: [
        { type: "bbox", bounds: [-62.41179575455658, -17.827799205708587, -62.16710476074727, -17.571467236429598] },   // Bolivia scene
        { type: "bbox", bounds: [32.36906007448464, 30.061444647963825, 32.66472446752274, 30.431698354460035] }    // Bitter Lake scene    
    ],
    blurb: "A small, tested Python library (wyvernhsi) plus two config-driven analysis projects built on it: ML-based land-cover classification over Bolivia and water-quality classification over Bitter Lake, Egypt, covering PCA composites, KMeans and Random Forest classification, spectral angle mapping, and NDTI/NDCI water-quality tier maps.",
    tech: [{ name: "Python", libs: ["Rasterio", "scikit-learn", "NumPy"] }, "PCA", "SAM", "KMeans"],
    data: ["Wyvern Dragonette hyperspectral", "STAC metadata", "MapBiomas Land Cover"],
    links: [
      { label: "GitHub", url: "https://github.com/geolime/wyvern-hsi-labs" }
    ],
    nda: false,
    full: "assets/projects/wyvern-hyperspectral/full.png",
    fullCaption: "PCA Composite of Bolivia Scene (RGB = PC1, PC2, PC3)",
    details: "The library (wyvernhsi) exists because one-off scripts don't scale across scenes: it converts L1B top-of-atmosphere radiance to TOA reflectance from STAC metadata and provides reusable raster I/O, QA and water masking, spectral indices, and PCA + KMeans building blocks. Each analysis project is then a thin orchestration layer, a YAML config and a single pipeline runner. On top of it I compared ML classification approaches for land cover over Santa Cruz de la Sierra and derived NDTI/NDCI-based water-quality indicators and optical water types for Bitter Lake.",
    gallery: [
      { src: "assets/projects/wyvern-hyperspectral/kmeans_K5_class_only.png", caption: "KMeans Clustering - Bolivia" },
      { src: "assets/projects/wyvern-hyperspectral/rf_classification.png", caption: "Random Forest Classification - Bolivia" },
      { src: "assets/projects/wyvern-hyperspectral/sam_class_only.png", caption: "Spectral Angle Mapping - Bolivia" },
      { src: "assets/projects/wyvern-hyperspectral/water_kmeans_K5_PCA8_pca_pc123.png", caption: "PCA - Bitter Lake" },
      { src: "assets/projects/wyvern-hyperspectral/ndci_tiers.png", caption: "NDCI Water-Quality Tiers - Bitter Lake" },
      { src: "assets/projects/wyvern-hyperspectral/ndti_tiers.png", caption: "NDTI Water-Quality Tiers - Bitter Lake" },
      { src: "assets/projects/wyvern-hyperspectral/optical_state_2x2.png", caption: "Optical Water State (NDCI/NDTI) - Bitter Lake" }
    ]
  },
  {
    slug: "tdc-fiber-denmark",
    title: "Fiber Rollout Planning with Network Routing & Constrained Clustering",
    years: "2023\u20132024",
    category: "Geospatial Data Science",
    kind: "Work",
    locationLabel: "Denmark",
    markers: [[9.8, 56.0]],
    footprints: [{ type: "named", id: "DNK" }],
    blurb: "Geospatial analytical models for national telecom planning: CRS standardization pipelines (pyproj, GeoPandas, Shapely), network distance and cost layers with NetworkX + OSMnx under road-class and crossing constraints, DBSCAN clustering with spatial constraints for rollout and decommissioning decisions, and monthly capacity forecasting with scikit-learn.",
    tech: [{ name: "Python", libs: ["OSMnx", "NetworkX", "scikit-learn", "GeoPandas"] }, "DBSCAN", "SQL"],
    data: ["OpenStreetMap", "Telecom infrastructure (NDA)"],
    links: [],
    nda: true,
    details: "Geospatial transformation pipelines run over all of Denmark, feeding routing algorithms and cost models that supported fiber rollout planning campaigns. The models earned their place with planners through the combination of visual and quantitative output: layers and dashboards that made prioritization defensible rather than intuitive. The same framework was later applied to copper decommissioning planning. Specifics are under NDA.",
    image: "assets/projects/tdc-fiber-denmark/full.png",
  },
  {
    slug: "undp-afghanistan",
    title: "Humanitarian Mapping & Change Detection (ABADEI)",
    years: "2021\u20132022",
    category: "Remote Sensing",
    kind: "Work",
    locationLabel: "Afghanistan",
    markers: [[66.0, 34.0]],
    footprints: [{ type: "named", id: "AFG" }],
    blurb: "Mapping projects supporting UNDP humanitarian programming, including MAXAR VHR change detection of greenhouse construction between 2017 and 2021, donor-reach mapping across Afghanistan, and security-risk-related cartography. Details and outputs are under NDA.",
    tech: ["ArcGIS", "Inkscape", "Change detection"],
    data: ["MAXAR VHR", "Sentinel-2", "UN data sources (NDA)"],
    links: [],
    nda: true,
    details: "Mapping in support of UNDP humanitarian programming under ABADEI: tracking donor outreach across programs, and using satellite imagery to assess the construction status of greenhouses built under cash-for-work programmes. Outputs and specifics are under NDA; the card graphic is an illustrative reconstruction, not project data.",
    image: "assets/projects/undp-afghanistan/full.png"
  },
  {
    slug: "canary-tsunami",
    title: "Tsunami Risk Assessment for the Canary Islands",
    years: "2021",
    category: "GIS Analysis",
    kind: "Personal",
    locationLabel: "Canary Islands, Spain",
    markers: [[-15.7, 28.3]],
    footprints: [{ type: "box", center: [-15.7, 28.3], km: [520, 220] }],
    blurb: "Island-by-island tsunami risk matrix built from weighted elevation, slope, and coastal-proximity layers, extended with GEBCO bathymetry risk. Overlaid against buildings and urban, agricultural, and natural land use to quantify exposed area from very-high to low risk classes.",
    tech: [{ name: "Python", libs: ["Rasterio", "NumPy"] }, "QGIS"],
    data: ["ASTER DEM", "GEBCO bathymetry"],
    links: [
      { label: "Report (PDF)", url: "assets/projects/canary-tsunami/report.pdf" }
    ],
    nda: false,
    full: "assets/projects/canary-tsunami/full.png",
    fullCaption: "Total Risk Exposure - Canary Islands",
    details: "Started during the September 2021 La Palma eruption: Cumbre Vieja is subject to slope instability and is frequently cited as one of the largest landslide-tsunami potentials in the world, which raised the practical question of what a tsunami would actually meet on the other islands' coasts. The weighted risk matrix put Fuerteventura, Lanzarote, and La Graciosa at highest risk, while most of the population lives on Tenerife and Gran Canaria, and more than half of the archipelago's urban land use area fell in the very-high or high risk classes.",
    gallery: [
      { src: "assets/projects/canary-tsunami/elevation-risk.png", caption: "Elevation Risk - Canary Islands" },
      { src: "assets/projects/canary-tsunami/slope-risk.png", caption: "Slope Risk - Canary Islands" },
      { src: "assets/projects/canary-tsunami/coastal-proximity-risk.png", caption: "Coastal Proximity Risk - Canary Islands" },
      { src: "assets/projects/canary-tsunami/bathymetry-risk.png", caption: "Bathymetry Risk - Canary Islands" },
      { src: "assets/projects/canary-tsunami/total-risk-urban.png", caption: "Urban Risk Exposure - Canary Islands" }
    ]
  },
  {
    slug: "abisko-watershed",
    title: "Abisko Watershed Catchment Mapping",
    years: "2021",
    category: "GIS Analysis",
    kind: "Personal",
    locationLabel: "Abisko National Park, Sweden",
    markers: [[18.75, 68.33]],
    footprints: [{ type: "box", center: [18.75, 68.33], km: [40, 40] }],
    blurb: "Catchment delineation and elevation mapping for the Abiskojokk river system in Arctic Sweden, combining ASTER DEM processing with Lantm\u00e4teriet data to map water bodies and the computed watershed of the surrounding national park area.",
    tech: ["QGIS", "Watershed delineation"],
    data: ["ASTER DEM", "Lantm\u00e4teriet"],
    links: [],
    nda: false,
    details: "A hydrology-driven piece: delineating the Abiskojokk catchment to understand the size and distribution of the drainage area feeding Lake Tornetr\u00e4sk, combining ASTER DEM processing with Lantm\u00e4teriet data over the national park terrain.",
    full: "assets/projects/abisko-watershed/full.png",
    fullCaption: "Abisko Watershed Catchment - Abisko National Park, Sweden",
  },
  {
    slug: "chernobyl-wildfire",
    title: "Chernobyl Exclusion Zone Wildfire Analysis",
    years: "2020",
    category: "Remote Sensing",
    kind: "Personal",
    locationLabel: "Chernobyl Exclusion Zone, Ukraine",
    markers: [[30.06, 51.38]],
    footprints: [{ type: "box", center: [30.06, 51.38], km: [60, 60] }],
    blurb: "Sentinel-2 analysis of the April 2020 wildfires around the Red Forest: NDVI differencing between June 2019 and June 2020 plus normalized burn ratio change analysis to quantify vegetation loss, cross-referenced against news-source fire timelines.",
    tech: [{ name: "Python", libs: ["Rasterio"] }, "QGIS", "NDVI", "NBR"],
    data: ["Sentinel-3, Sentinel-2"],
    links: [
      { label: "Report (PDF)", url: "assets/projects/chernobyl-wildfire/report.pdf" }
    ],
    nda: false,
    full: "assets/projects/chernobyl-wildfire/full.png",
    fullCaption: "Change Detection - Chernobyl Exclusion Zone",
    details: "One-year change analysis bracketing the April 2020 fires: NDVI and NBR differencing between June 2019 and June 2020 made the burn impact visible and comparable, separating the areas of greatest vegetation loss around the Red Forest from the parts of the Exclusion Zone that changed least. The original source imagery has since been lost, so the surviving deliverable is the full report.",
    gallery: [
      { src: "assets/projects/chernobyl-wildfire/chernobyl_ndvi_change.png", caption: "NDVI Change - Chernobyl Exclusion Zone" },
      { src: "assets/projects/chernobyl-wildfire/chernobyl_nbr_change.png", caption: "Normalized Burn Ratio Change - Chernobyl Exclusion Zone" }
    ]
  },
  {
    slug: "urban-accessibility",
    title: "Urban Accessibility Studies at National Scale",
    years: "2019\u20132020",
    category: "Geospatial Data Science",
    kind: "Work",
    locationLabel: "Malm\u00f6 / Sk\u00e5ne / Halland / Stockholm, Sweden",
    markers: [[13.0, 55.6]],
    footprints: [
        { type: "named", id: "SWE-SKANE" },
        { type: "named", id: "SWE-HALLAND" },
        { type: "named", id: "SWE-STOCKHOLM" }  
    ],
    blurb: "Data extraction and analysis pipelines for accessibility research on nationwide Swedish registry data (~6 billion records over 30 years), computing distances from residents and workplaces to railway stations, plus thematic city-district mapping such as price and living area per square meter.",
    tech: [{ name: "Python", libs: ["psycopg2", "pandas"] }, "R", { name: "PostgreSQL", libs: ["PostGIS"] }, "QGIS", "ArcGIS"],
    data: ["Swedish registry microdata"],
    links: [
      { label: "Project record (DiVA)", url: "https://mdh.diva-portal.org/smash/project.jsf?pid=project%3A2508" },
      { label: "Paper (JTLU)", url: "https://doi.org/10.5198/jtlu.2021.1664" }
    ],
    nda: false,
    full: "assets/projects/urban-accessibility/full.png",
    fullCaption: "False Color Composite of Malmö (RGB = Sentinel-2 B8, B4, B3)",
    details: "The research questions were about how the city is actually distributed: average living area and price per square meter across Malm\u00f6, how housing prices and people are spread through the city, and which train stations workers commute to from where across Malm\u00f6 and the Sk\u00e5ne region. Maps I produced were used in a peer-reviewed paper in the Journal of Transport and Land Use, and map templates I built have been reused in the group's publications since.",
    gallery: [
      { src: "assets/projects/urban-accessibility/malmo_mean_price.png", caption: "Average Price (m2) - Malmö" },
      { src: "assets/projects/urban-accessibility/malmo_mean_area.png", caption: "Average Living Area (m2) - Malmö" },
      { src: "assets/projects/urban-accessibility/malmo_price_heatmap.png", caption: "Price Heatmap - Malmö" },
      { src: "assets/projects/urban-accessibility/malmo_workplace_diff.png", caption: "Workplace Distance - Malmö" },
      { src: "assets/projects/urban-accessibility/nacka_transactions.png", caption: "Apartment Transactions over Time - Nacka Municipality, Stockholm Region" },
      { src: "assets/projects/urban-accessibility/malmo_skane_share.png", caption: "Working Distance Distribution to Hyllie station - Skåne Region" },
      { src: "assets/projects/urban-accessibility/halland_railway_update.png", caption: "Train Access (New & Old) - Halland Region" }
    ]
  },
  {
    slug: "spatial-runner",
    title: "Spatial Runner: Environment-Weighted Routing Networks",
    years: "2017",
    category: "GIS / Routing",
    kind: "Thesis",
    locationLabel: "Yverdon-les-Bains, Switzerland",
    markers: [[6.64, 46.78]],
    footprints: [{ type: "box", center: [6.64, 46.78], km: [15, 15] }],
    blurb: "Master's thesis building a turn-restricted, environment-weighted road network (TSP-style same-node start/finish) from DEM slope, OSM, and 30 cm SwissTopo aerial imagery via GRVI and urban/natural structure weighting, generating vegetation-positive and urban-positive routes to test runners' stress response with heart-rate and trajectory data.",
    tech: [{ name: "PostgreSQL", libs: ["PostGIS", "pgRouting"] }, { name: "Python", libs: ["psycopg2"] }, "QGIS", "GRVI"],
    data: ["SwissTopo 30 cm aerial", "OpenStreetMap", "Garmin HR & trajectories"],
    links: [
      { label: "Publication (LUP)", url: "https://lup.lub.lu.se/student-papers/search/publication/8928390" }
    ],
    nda: false,
    full: "assets/projects/spatial-runner/full.png",
    fullCaption: "Urban Route - Yverdon-les-Bains",
    details: "The routing engine was the means; the question was physiological. Across four trials per route type (two with music), runners on vegetation-positive routes showed lower heart rates than on urban-positive routes, and the music trials added a second effect: higher cadence when running with music. A thesis-scale sample, so indicative rather than conclusive, but the direction was consistent.",
    gallery: [
      { src: "assets/projects/spatial-runner/urban_route.png", caption: "Urban Route - Yverdon-les-Bains" },
      { src: "assets/projects/spatial-runner/nature_route_traj.png", caption: "Natural Route Trajectory - Yverdon-les-Bains" },
      { src: "assets/projects/spatial-runner/urban_route_traj.png", caption: "Urban Route Trajectory - Yverdon-les-Bains" }
    ]
  },
  {
    slug: "cloud-frequency-central-america",
    title: "MODIS Cloud Frequency Mapping for Drought Monitoring",
    years: "2016",
    category: "Remote Sensing",
    kind: "Work",
    locationLabel: "Guatemala, Honduras & El Salvador",
    markers: [[-88.9, 14.6]],
    footprints: [
        { type: "named", id: "GTM" },
        { type: "named", id: "HND" },
        { type: "named", id: "SLV" }
    ],
    blurb: "UN-SPIDER work mapping cloud frequency from MODIS pixel reliability to strengthen VCI drought-index preprocessing: 16-day composite cloud-frequency percentages for Guatemala, Honduras, and El Salvador across a 16-year time series (2000\u20132016), delivered as per-country animations, with the pixel reliability band adopted into the recommended VCI workflow.",
    tech: ["R", "QGIS", "VCI"],
    data: ["MODIS"],
    links: [
      { label: "GitHub", url: "https://github.com/geolime/Cloud_Frequency_Remote_Sensing" },
      { label: "UN-SPIDER Recommended Practice", url: "https://un-spider.org/advisory-support/recommended-practices/recommended-practice-drought-monitoring/in-detail" }
    ],
    nda: false,
    video: "assets/projects/cloud-frequency-central-america/guatemala.mp4",
    details: "The 16-year MODIS record showed a strong seasonal structure: cloud cover over Guatemala, Honduras, and El Salvador rises substantially from spring through early winter, with only the early-winter-to-early-spring window reliably clear. That matters because VCI drought monitoring silently degrades under cloud contamination, and my analysis of the pixel reliability band's distribution over the region contributed to that preprocessing step being adopted into the UN-SPIDER recommended practice.",
    gallery: [
      { src: "assets/projects/cloud-frequency-central-america/honduras.mp4", caption: "Honduras \u2014 16-day cloud frequency, 2000\u20132016" },
      { src: "assets/projects/cloud-frequency-central-america/el-salvador.mp4", caption: "El Salvador \u2014 16-day cloud frequency, 2000\u20132016" }
    ]
  }
];