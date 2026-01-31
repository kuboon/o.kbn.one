// 曜日の名前
const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

// 現在の日付を取得
const today = new Date();

// DOM要素の取得
const imageUpload = document.getElementById("image-upload") as HTMLInputElement;
const imageContainer = document.getElementById(
  "image-container",
) as HTMLDivElement;
const yearSelect = document.getElementById("year-select") as HTMLSelectElement;
const monthSelect = document.getElementById(
  "month-select",
) as HTMLSelectElement;
const calendarHeader = document.getElementById(
  "calendar-header",
) as HTMLDivElement;
const calendar = document.getElementById("calendar") as HTMLDivElement;

// 画像アップロード処理
function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target?.result as string;
      imageContainer.innerHTML = "";
      imageContainer.classList.remove("empty");
      imageContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
}

imageUpload.addEventListener("change", handleImageUpload);

// 年のセレクトボックスを初期化（現在の年の前後10年）
function initYearSelect() {
  const currentYear = today.getFullYear();
  for (let year = currentYear - 10; year <= currentYear + 10; year++) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    if (year === currentYear) {
      option.selected = true;
    }
    yearSelect.appendChild(option);
  }
}

// 月のセレクトボックスを初期化
function initMonthSelect() {
  for (let month = 1; month <= 12; month++) {
    const option = document.createElement("option");
    option.value = String(month);
    option.textContent = String(month);
    if (month === today.getMonth() + 1) {
      option.selected = true;
    }
    monthSelect.appendChild(option);
  }
}

// 指定された年月の日数を取得
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// 指定された年月の最初の日の曜日を取得（0: 日曜日, 6: 土曜日）
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

// 今日の日付かどうかを判定
function isToday(year: number, month: number, day: number): boolean {
  return (
    year === today.getFullYear() &&
    month === today.getMonth() + 1 &&
    day === today.getDate()
  );
}

// カレンダーを生成
function generateCalendar(year: number, month: number) {
  // ヘッダーを更新
  calendarHeader.textContent = `${year}年 ${month}月`;

  // カレンダーをクリア
  calendar.innerHTML = "";

  // 曜日ヘッダーを追加
  DAYS_OF_WEEK.forEach((day, index) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-day-header";
    if (index === 0) {
      dayHeader.classList.add("sunday");
    } else if (index === 6) {
      dayHeader.classList.add("saturday");
    }
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });

  // 月の日数と最初の曜日を取得
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // 最初の週の空白セルを追加
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    calendar.appendChild(emptyDay);
  }

  // 日付セルを追加
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";

    // 曜日を計算
    const dayOfWeek = (firstDay + day - 1) % 7;
    if (dayOfWeek === 0) {
      dayCell.classList.add("sunday");
    } else if (dayOfWeek === 6) {
      dayCell.classList.add("saturday");
    }

    // 今日の日付かチェック
    if (isToday(year, month, day)) {
      dayCell.classList.add("today");
    }

    const dateSpan = document.createElement("span");
    dateSpan.className = "date";
    dateSpan.textContent = String(day);
    dayCell.appendChild(dateSpan);

    calendar.appendChild(dayCell);
  }
}

// セレクトボックスの変更イベントをリッスン
function onSelectionChange() {
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  generateCalendar(year, month);
}

yearSelect.addEventListener("change", onSelectionChange);
monthSelect.addEventListener("change", onSelectionChange);

// 初期化
initYearSelect();
initMonthSelect();
generateCalendar(today.getFullYear(), today.getMonth() + 1);
