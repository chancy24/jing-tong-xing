document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("trafficTable");
  tbody.innerHTML = COMMUTE_DATA.lines
    .map((line) => {
      const tagClass = line.crowdedLevel >= 3 ? "warn" : "green";
      return `
        <tr>
          <td>${line.routeName}</td>
          <td>${COMMUTE_DATA.modeLabels[line.mode] || line.mode}</td>
          <td><span class="tag ${tagClass}">${line.status}</span></td>
          <td>${line.crowdedLevel}</td>
          <td>${line.nextArrival}</td>
          <td>${line.operationTime}</td>
        </tr>
      `;
    })
    .join("");
});

