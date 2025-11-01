let gorevler = JSON.parse(localStorage.getItem("gorevler")) || [];
let aktifFiltre = "tum";

// Tabloya görev ekleme fonksiyonu
function tabloyaEkle(gorev) {
  const tbody = document.getElementById("tbod");
  const yeniSatir = document.createElement("tr");

  // Checkbox hücresi
  const checkboxHucre = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = gorev.yapildi;
  checkbox.addEventListener("change", () => {
    gorev.yapildi = checkbox.checked;
    localStorageGuncelle();
    filtrele(aktifFiltre);
  });
  checkboxHucre.appendChild(checkbox);
  yeniSatir.appendChild(checkboxHucre);

  // Görev adı hücresi
  const adHucre = document.createElement("td");
  adHucre.textContent = gorev.ad;
  yeniSatir.appendChild(adHucre);

  // Tarih hücresi
  const tarihHucre = document.createElement("td");
  const tarihObj = new Date(gorev.tarih);
  tarihHucre.textContent = tarihObj.toLocaleDateString("tr-TR") + " " + tarihObj.toLocaleTimeString("tr-TR");
  yeniSatir.appendChild(tarihHucre);

  // Silme butonu hücresi
  const silHucre = document.createElement("td");
  const silButon = document.createElement("button");
  silButon.textContent = "Sil";
  silButon.className = "sil";
  silButon.addEventListener("click", () => {
    gorevler = gorevler.filter(g => g !== gorev);
    localStorageGuncelle();
    filtrele(aktifFiltre);
  });
  silHucre.appendChild(silButon);
  yeniSatir.appendChild(silHucre);

  // Düzenleme butonu hücresi
  const duzenleHucre = document.createElement("td");
  const duzenleButon = document.createElement("button");
  duzenleButon.textContent = "Düzenle";
  duzenleButon.className = "duzenle";
  duzenleButon.addEventListener("click", () => {
    const yeniAd = prompt("Yeni görev adını gir:", gorev.ad);
    if (yeniAd && yeniAd.trim() !== "") {
      gorev.ad = yeniAd.trim();
      localStorageGuncelle();
      filtrele(aktifFiltre);
    }
  });
  duzenleHucre.appendChild(duzenleButon);
  yeniSatir.appendChild(duzenleHucre);

  tbody.appendChild(yeniSatir);
}

// localStorage güncelleme fonksiyonu
function localStorageGuncelle() {
  localStorage.setItem("gorevler", JSON.stringify(gorevler));
}

// Görev ekleme fonksiyonu
function yenigorevekle() {
  const ad = prompt("Yeni Görev Adı:");
  if (!ad || ad.trim() === "") {
    alert("Lütfen görev adı girin.");
    return;
  }

  const yeniGorev = {
    ad: ad.trim(),
    yapildi: false,
    tarih: new Date().toISOString()
  };

  gorevler.push(yeniGorev);
  localStorageGuncelle();
  filtrele(aktifFiltre);
}

// Filtreleme fonksiyonu
function filtrele(tur) {
  aktifFiltre = tur;
  const tbody = document.getElementById("tbod");
  tbody.innerHTML = "";

  let filtrelenmis = [];
  if (tur === "tum") {
    filtrelenmis = gorevler;
  } else if (tur === "tamamlanan") {
    filtrelenmis = gorevler.filter(g => g.yapildi);
  } else if (tur === "aktif") {
    filtrelenmis = gorevler.filter(g => !g.yapildi);
  }

  // Arama inputundaki metni al ve uygula
  const aramaMetni = document.getElementById("gorevAra").value.trim().toLowerCase();
  if (aramaMetni !== "") {
    filtrelenmis = filtrelenmis.filter(g => g.ad.toLowerCase().includes(aramaMetni));
  }

  filtrelenmis.forEach(g => tabloyaEkle(g));
}

// Arama inputu için event listener
document.getElementById("gorevAra").addEventListener("input", () => {
  filtrele(aktifFiltre);
});

// Tarihe göre sıralama fonksiyonu (düzenlendi)
function tariheGoreSirala() {
  // Görevleri tarihe göre sırala
  gorevler.sort((a, b) => new Date(a.tarih) - new Date(b.tarih));
  localStorageGuncelle();
  filtrele(aktifFiltre);
}

// Sayfa yüklendiğinde görevleri göster
window.onload = () => {
  filtrele("tum");
};

// Butonlara event listener ekle
document.getElementById("btnYeniGorev").addEventListener("click", yenigorevekle);
document.getElementById("btnTum").addEventListener("click", () => filtrele("tum"));
document.getElementById("btnTamamlanan").addEventListener("click", () => filtrele("tamamlanan"));
document.getElementById("btnAktif").addEventListener("click", () => filtrele("aktif"));
document.getElementById("btnSirala").addEventListener("click", tariheGoreSirala);