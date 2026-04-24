import SwiftUI
import AppKit

struct WeeklyMetric: Identifiable {
    let id = UUID()
    var period: String
    var visits: Double
    var orders: Double
    var revenue: Double
    var adSpend: Double
}

struct ProductMetric: Identifiable {
    let id = UUID()
    var name: String
    var sku: String
    var stock: Double
    var reorder: Double
    var cost: Double
    var price: Double
}

struct WorkItem: Identifiable {
    let id = UUID()
    var title: String
    var detail: String
    var status: String
    var value: Double = 0
}

enum AppSection: String, CaseIterable, Identifiable {
    case dashboard = "Dashboard"
    case insights = "Insights"
    case accounts = "Accounts"
    case selling = "Selling"
    case marketing = "Marketing"
    case social = "Social"
    case inventory = "Inventory"
    case website = "Website"
    case news = "News"
    case suggestions = "Ideas"

    var id: String { rawValue }
}

@main
struct ZabhlaCommandCenterApp: App {
    var body: some Scene {
        WindowGroup {
            CommandCenterView()
                .frame(minWidth: 1120, minHeight: 760)
        }
        .windowStyle(.hiddenTitleBar)
    }
}

struct CommandCenterView: View {
    @State private var selection: AppSection = .dashboard
    @State private var weekly = [
        WeeklyMetric(period: "Week 1", visits: 850, orders: 18, revenue: 42000, adSpend: 9000),
        WeeklyMetric(period: "Week 2", visits: 1200, orders: 26, revenue: 67000, adSpend: 12000),
        WeeklyMetric(period: "Week 3", visits: 1540, orders: 34, revenue: 89000, adSpend: 14500),
        WeeklyMetric(period: "Week 4", visits: 1900, orders: 44, revenue: 116000, adSpend: 17000)
    ]
    @State private var products = [
        ProductMetric(name: "Oversized Unisex Tee", sku: "ZAB-TEE-OS", stock: 0, reorder: 20, cost: 0, price: 0),
        ProductMetric(name: "Women's Denim Capri", sku: "ZAB-WDC", stock: 0, reorder: 12, cost: 0, price: 0),
        ProductMetric(name: "Men's Embroidered Denim Pant 1", sku: "ZAB-MEDP-01", stock: 0, reorder: 8, cost: 0, price: 0),
        ProductMetric(name: "Men's Embroidered Denim Pant 2", sku: "ZAB-MEDP-02", stock: 0, reorder: 8, cost: 0, price: 0)
    ]
    @State private var marketing = [
        WorkItem(title: "First focused catalog launch", detail: "Instagram launch for tees, capri, and embroidered denim pants", status: "In Progress", value: 15000),
        WorkItem(title: "Creator shortlist", detail: "India streetwear, denim, and campus fashion creators", status: "Planned", value: 25000)
    ]
    @State private var social = [
        WorkItem(title: "Oversized tee fit check", detail: "Reel for campus, cafe, and night styling", status: "Planned"),
        WorkItem(title: "Denim detail shots", detail: "Women's capri plus men's embroidery closeups", status: "Idea")
    ]
    @State private var website = [
        WorkItem(title: "zabhla.com Home", detail: "Update hero for focused first catalog", status: "Open"),
        WorkItem(title: "Product pages", detail: "Create Shopify pages for the four active product lines", status: "Open")
    ]
    @State private var accounts = [
        WorkItem(title: "Shopify Sales", detail: "First drop online sales", status: "Received", value: 42000),
        WorkItem(title: "Production", detail: "Samples and embroidery work", status: "Paid", value: -18500),
        WorkItem(title: "Vendor Payable", detail: "Pending denim stitching balance", status: "Pending", value: -12000)
    ]
    @State private var selling = [
        WorkItem(title: "Online Customer", detail: "8 oversized tees through Shopify", status: "Packed", value: 11992),
        WorkItem(title: "Campus Lead", detail: "3 women's denim capri via Instagram DM", status: "Lead", value: 7497)
    ]
    @State private var launchUnits = 90.0
    @State private var launchPrice = 1499.0
    @State private var launchCost = 620.0
    @State private var launchAds = 16000.0

    var body: some View {
        HStack(spacing: 18) {
            sidebar
            VStack(spacing: 16) {
                topbar
                ScrollView { activeView.padding(.bottom, 24) }
            }
        }
        .padding(18)
        .background(background)
    }

    private var background: some View {
        LinearGradient(colors: [Color(red: 0.98, green: 0.94, blue: 0.88), Color(red: 0.90, green: 0.98, blue: 0.97), Color(red: 0.98, green: 0.92, blue: 0.96)], startPoint: .topLeading, endPoint: .bottomTrailing)
            .ignoresSafeArea()
    }

    private var sidebar: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 12) {
                Image(nsImage: NSImage(named: "zabhla-logo") ?? NSImage())
                    .resizable()
                    .scaledToFit()
                    .frame(width: 48, height: 48)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 14))
                VStack(alignment: .leading, spacing: 2) {
                    Text("Zabhla").font(.system(size: 30, weight: .bold, design: .serif))
                    Text("Command Center").foregroundStyle(.secondary)
                }
            }
            ForEach(AppSection.allCases) { section in
                Button {
                    selection = section
                } label: {
                    HStack {
                        Text(section.rawValue)
                        Spacer()
                    }
                    .padding(.vertical, 10)
                    .padding(.horizontal, 12)
                    .background(selection == section ? Color.white.opacity(0.65) : Color.clear)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .buttonStyle(.plain)
            }
            Spacer()
            Link("Open zabhla.com", destination: URL(string: "https://zabhla.com/")!)
                .fontWeight(.bold)
                .foregroundStyle(.white)
                .padding(.vertical, 11)
                .frame(maxWidth: .infinity)
                .background(Color.black.opacity(0.82))
                .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .padding(18)
        .frame(width: 280)
        .glass()
    }

    private var topbar: some View {
        HStack {
            VStack(alignment: .leading, spacing: 3) {
                Text("Zabhla live workspace").font(.caption).fontWeight(.bold).foregroundStyle(.secondary)
                Text(selection.rawValue).font(.title2).fontWeight(.bold)
            }
            Spacer()
            Text("Focused catalog only")
                .font(.caption)
                .fontWeight(.bold)
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color.white.opacity(0.55))
                .clipShape(Capsule())
        }
        .padding(16)
        .glass()
    }

    @ViewBuilder private var activeView: some View {
        switch selection {
        case .dashboard: dashboard
        case .insights: insights
        case .accounts: department(title: "Accounts Department", subtitle: "Income, expenses, payables, receivables, tax planning, and cash position.", items: $accounts, valuePrefix: true)
        case .selling: department(title: "Selling Department", subtitle: "Sales, leads, channels, demand, fulfillment status, returns risk, and follow-up notes.", items: $selling, valuePrefix: true)
        case .marketing: department(title: "Marketing Work", subtitle: "Campaigns, creators, launch tasks, ads, offers, and brand work.", items: $marketing, valuePrefix: true)
        case .social: department(title: "Social Content Calendar", subtitle: "Instagram, TikTok, YouTube, Pinterest, and blog-share planning.", items: $social, valuePrefix: false)
        case .inventory: inventory
        case .website: department(title: "Website Tracker", subtitle: "zabhla.com SEO, pages, product copy, bugs, and conversion work.", items: $website, valuePrefix: false)
        case .news: news
        case .suggestions: suggestions
        }
    }

    private var dashboard: some View {
        VStack(spacing: 16) {
            hero
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 14) {
                metric("Marketing", "\(marketing.filter { $0.status != "Done" }.count)", "active tasks")
                metric("Social", "\(social.filter { $0.status != "Posted" }.count)", "planned posts")
                metric("Inventory", "\(products.filter { $0.stock <= $0.reorder }.count)", "low stock")
                metric("Website", "\(website.filter { $0.status != "Done" }.count)", "open tasks")
                metric("Accounts", money(accounts.map(\.value).reduce(0, +)), "net balance")
                metric("Selling", money(selling.map(\.value).reduce(0, +)), "tracked sales")
            }
            HStack(alignment: .top, spacing: 16) {
                panel("Revenue Pulse") { LineChart(rows: weekly, first: \.revenue, second: \.adSpend) }
                panel("Inventory Health") { BarStack(values: products.map { ($0.name, $0.stock, max($0.reorder, 1)) }) }
            }
            HStack(alignment: .top, spacing: 16) {
                panel("Next Actions") { VStack(alignment: .leading, spacing: 10) { ForEach(actionIdeas(), id: \.self) { Text($0).cardLine() } } }
                panel("Industry Signals") { VStack(alignment: .leading, spacing: 10) { newsItems } }
            }
        }
    }

    private var hero: some View {
        HStack(alignment: .top, spacing: 18) {
            VStack(alignment: .leading, spacing: 12) {
                Text("Focused catalog").font(.caption).fontWeight(.bold).foregroundStyle(.secondary)
                Text("Oversized unisex tees, women's denim capri, and two men's embroidered denim pants.")
                    .font(.system(size: 40, weight: .bold, design: .serif))
                    .lineLimit(3)
                Text("Track marketing, social media, Shopify inventory, zabhla.com work, accounts, selling, news, and next actions from one glass workspace.")
                    .foregroundStyle(.secondary)
                HStack { chip("zabhla.com"); chip("India-first news"); chip("Shopify-ready") }
            }
            Spacer()
            VStack(alignment: .leading, spacing: 8) {
                Text("Today").font(.caption).fontWeight(.bold).foregroundStyle(.secondary)
                Text(actionIdeas().first ?? "Keep the first drop tight and measurable.").fontWeight(.bold)
            }
            .padding(16)
            .background(Color.white.opacity(0.55))
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .frame(width: 290)
        }
        .padding(24)
        .glass()
    }

    private var insights: some View {
        VStack(spacing: 16) {
            HStack(spacing: 16) {
                metric("Revenue", money(weekly.map(\.revenue).reduce(0, +)), "weekly entries")
                metric("Orders", "\(Int(weekly.map(\.orders).reduce(0, +)))", "tracked")
                metric("ROAS", String(format: "%.1fx", weekly.map(\.revenue).reduce(0, +) / max(weekly.map(\.adSpend).reduce(0, +), 1)), "revenue / ads")
                metric("Readiness", "\(readinessScore())%", "launch")
            }
            HStack(alignment: .top, spacing: 16) {
                panel("Revenue vs Ad Spend") { LineChart(rows: weekly, first: \.revenue, second: \.adSpend) }
                panel("Product Stock") { BarStack(values: products.map { ($0.name, $0.stock, max($0.reorder, 1)) }) }
            }
            panel("Editable Weekly KPI Values") {
                VStack(spacing: 10) {
                    ForEach($weekly) { $row in
                        HStack {
                            TextField("Period", text: $row.period)
                            numeric("Visits", value: $row.visits)
                            numeric("Orders", value: $row.orders)
                            numeric("Revenue", value: $row.revenue)
                            numeric("Ad Spend", value: $row.adSpend)
                        }
                    }
                    Button("Add Week") { weekly.append(WeeklyMetric(period: "Week \(weekly.count + 1)", visits: 0, orders: 0, revenue: 0, adSpend: 0)) }
                }
            }
            HStack(alignment: .top, spacing: 16) {
                panel("Product Control") {
                    VStack(spacing: 10) {
                        ForEach($products) { $product in
                            VStack(alignment: .leading, spacing: 8) {
                                Text(product.name).fontWeight(.bold)
                                HStack { numeric("Stock", value: $product.stock); numeric("Reorder", value: $product.reorder); numeric("Cost", value: $product.cost); numeric("Price", value: $product.price) }
                            }
                            .padding(12)
                            .background(Color.white.opacity(0.45))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                }
                panel("Drop Simulator") {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack { numeric("Units", value: $launchUnits); numeric("Price", value: $launchPrice); numeric("Cost", value: $launchCost); numeric("Ads", value: $launchAds) }
                        Text("Revenue: \(money(launchUnits * launchPrice))")
                        Text("Net profit after ads: \(money((launchPrice - launchCost) * launchUnits - launchAds))")
                        Text("Break-even units: \(Int(ceil(launchAds / max(launchPrice - launchCost, 1))))")
                    }
                }
            }
        }
    }

    private var inventory: some View {
        VStack(spacing: 16) {
            panel("Shopify Inventory Control") {
                VStack(spacing: 10) {
                    ForEach($products) { $product in
                        VStack(alignment: .leading, spacing: 8) {
                            Text(product.name).font(.headline)
                            Text(product.sku).foregroundStyle(.secondary)
                            HStack { numeric("Stock", value: $product.stock); numeric("Reorder", value: $product.reorder); numeric("Cost", value: $product.cost); numeric("Price", value: $product.price) }
                            Text(product.stock <= product.reorder ? "Low Stock" : "OK").foregroundStyle(product.stock <= product.reorder ? .orange : .green).fontWeight(.bold)
                        }
                        .padding(14)
                        .background(Color.white.opacity(0.45))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                }
            }
        }
    }

    private var news: some View {
        panel("Industry Blog & News") {
            VStack(alignment: .leading, spacing: 10) {
                Text("India-first watchlist for oversized tees, denim, ecommerce, Shopify, sustainability, creators, and streetwear.")
                    .foregroundStyle(.secondary)
                newsItems
            }
        }
    }

    private var suggestions: some View {
        HStack(alignment: .top, spacing: 16) {
            panel("Recommended Actions") { VStack(alignment: .leading, spacing: 10) { ForEach(actionIdeas(), id: \.self) { Text($0).cardLine() } } }
            panel("Build Next") { VStack(alignment: .leading, spacing: 10) { ForEach(nextBuildIdeas, id: \.self) { Text($0).cardLine() } } }
        }
    }

    private func department(title: String, subtitle: String, items: Binding<[WorkItem]>, valuePrefix: Bool) -> some View {
        VStack(spacing: 16) {
            panel(title) {
                VStack(alignment: .leading, spacing: 12) {
                    Text(subtitle).foregroundStyle(.secondary)
                    ForEach(items) { $item in
                        VStack(alignment: .leading, spacing: 8) {
                            HStack { TextField("Title", text: $item.title).font(.headline); Spacer(); TextField("Status", text: $item.status).frame(width: 130) }
                            TextField("Detail", text: $item.detail)
                            if valuePrefix { numeric("Value", value: $item.value) }
                        }
                        .padding(14)
                        .background(Color.white.opacity(0.45))
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                    }
                    Button("Add Item") { items.wrappedValue.insert(WorkItem(title: "New item", detail: "", status: "Open"), at: 0) }
                }
            }
        }
    }

    private var newsItems: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Use news feed in the web app for live Google News RSS. Desktop placeholder angles:").font(.caption).foregroundStyle(.secondary)
            Text("India denim demand, campus streetwear, Shopify checkout updates, sustainable cotton, and creator commerce.").cardLine()
            Text("Turn the top relevant headline into a Zabhla blog post or social hook each morning.").cardLine()
        }
    }

    private var nextBuildIdeas: [String] {
        [
            "Host the web app with a shared database so iPhone works anywhere, not only on the same Wi-Fi.",
            "Connect Shopify Admin API for live stock, prices, products, and low-stock alerts.",
            "Connect Google, Meta, TikTok, and YouTube analytics for automatic graphs.",
            "Generate blog drafts from the live clothing industry news feed."
        ]
    }

    private func actionIdeas() -> [String] {
        var ideas = ["Keep the catalog limited to oversized unisex tees, women's denim capri, and two men's embroidered denim pants."]
        products.filter { $0.stock <= $0.reorder }.forEach { ideas.append("Restock \($0.name): stock \(Int($0.stock)), reorder point \(Int($0.reorder)).") }
        if accounts.contains(where: { $0.status == "Pending" }) { ideas.append("Accounts: clear pending vendor or tax items before buying more inventory.") }
        if selling.contains(where: { $0.status != "Delivered" && $0.status != "Closed" }) { ideas.append("Selling: follow up open leads and update fulfillment today.") }
        ideas.append("Website: keep zabhla.com hero and product pages focused on only the four current product lines.")
        return ideas
    }

    private func readinessScore() -> Int {
        let stocked = Double(products.filter { $0.stock > 0 }.count) / Double(max(products.count, 1))
        let priced = Double(products.filter { $0.price > $0.cost && $0.price > 0 }.count) / Double(max(products.count, 1))
        let websiteDone = Double(website.filter { $0.status == "Done" }.count) / Double(max(website.count, 1))
        return Int((stocked * 35 + priced * 35 + websiteDone * 30).rounded())
    }

    private func metric(_ title: String, _ value: String, _ caption: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title).foregroundStyle(.secondary).fontWeight(.semibold)
            Text(value).font(.title).fontWeight(.bold).lineLimit(1).minimumScaleFactor(0.65)
            Text(caption).font(.caption).foregroundStyle(.secondary)
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .glass()
    }

    private func panel<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(title).font(.headline)
            content()
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .topLeading)
        .glass()
    }

    private func chip(_ text: String) -> some View {
        Text(text).font(.caption).fontWeight(.bold).padding(.horizontal, 10).padding(.vertical, 7).background(Color.white.opacity(0.55)).clipShape(Capsule())
    }

    private func numeric(_ title: String, value: Binding<Double>) -> some View {
        TextField(title, value: value, format: .number)
            .textFieldStyle(.roundedBorder)
            .frame(minWidth: 86)
    }

    private func money(_ value: Double) -> String {
        "INR " + Int(value).formatted(.number.grouping(.automatic))
    }
}

struct LineChart: View {
    let rows: [WeeklyMetric]
    let first: KeyPath<WeeklyMetric, Double>
    let second: KeyPath<WeeklyMetric, Double>

    var body: some View {
        GeometryReader { geo in
            let maxValue = max(rows.map { max($0[keyPath: first], $0[keyPath: second]) }.max() ?? 1, 1)
            ZStack {
                chartLine(geo: geo, maxValue: maxValue, key: first, color: .teal)
                chartLine(geo: geo, maxValue: maxValue, key: second, color: .orange)
            }
        }
        .frame(height: 220)
    }

    private func chartLine(geo: GeometryProxy, maxValue: Double, key: KeyPath<WeeklyMetric, Double>, color: Color) -> some View {
        Path { path in
            for index in rows.indices {
                let x = rows.count <= 1 ? 0 : geo.size.width * CGFloat(index) / CGFloat(rows.count - 1)
                let y = geo.size.height - (geo.size.height * CGFloat(rows[index][keyPath: key] / maxValue))
                index == rows.startIndex ? path.move(to: CGPoint(x: x, y: y)) : path.addLine(to: CGPoint(x: x, y: y))
            }
        }
        .stroke(color, style: StrokeStyle(lineWidth: 5, lineCap: .round, lineJoin: .round))
    }
}

struct BarStack: View {
    let values: [(String, Double, Double)]
    var body: some View {
        VStack(spacing: 12) {
            ForEach(values, id: \.0) { label, value, limit in
                VStack(alignment: .leading, spacing: 6) {
                    HStack { Text(label).fontWeight(.semibold); Spacer(); Text("\(Int(value)) / \(Int(limit))").foregroundStyle(value <= limit ? .orange : .green) }
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            Capsule().fill(Color.white.opacity(0.55))
                            Capsule().fill(value <= limit ? Color.orange : Color.teal).frame(width: geo.size.width * CGFloat(min(value / max(limit * 2, 1), 1)))
                        }
                    }
                    .frame(height: 14)
                }
            }
        }
    }
}

extension View {
    func glass() -> some View {
        self.background(.ultraThinMaterial).clipShape(RoundedRectangle(cornerRadius: 20)).shadow(color: .black.opacity(0.10), radius: 24, x: 0, y: 14)
    }

    func cardLine() -> some View {
        self.padding(12).frame(maxWidth: .infinity, alignment: .leading).background(Color.white.opacity(0.46)).clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
