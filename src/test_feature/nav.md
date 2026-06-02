<nav className="bg-black text-greywhite px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex space-x-6 items-center">
          <div className="font-bold text-2xl text-red theme-street:font-graffiti">LOGO</div>
          {[t.menu, t.order, t.reward].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-orange transition">{item}</a>
          ))}
        </div>
        <div className="flex space-x-4 items-center">
          <a href="#login" className="hover:text-orange">{t.register}</a>
          {/* โหมดเปลี่ยนภาษา (TH/EN) */}
          <select
            className="bg-greywhite text-black px-2 py-1 outline-none font-bold theme-genz:rounded-full"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="TH">TH</option>
            <option value="EN">EN</option>
          </select>
        </div>
      </nav>
