import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartUsage = ({ teams, tokenRes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [totaltPricing, setTotalPricing] = useState([]);
  const [chartPricing, setChartPricing] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [minDate, setMinDate] = useState();
  const [maxDate, setMaxDate] = useState();
  const [modelSetArray, setModelSetArray] = useState([]);
  const modelSet = new Set();

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#E17171",
    "#F1F18D",
    "#8DB3F1",
    "#F18D8D",
    "#8DF19F",
  ];

  useEffect(() => {
    tokenRes.forEach((item) => {
      if (item.model) modelSet.add(item.model);
    });
    modelSet.add("fonctions");
    setModelSetArray(Array.from(modelSet));
    setIsLoading(false);
    //eslint-disable-next-line
  }, [tokenRes]);

  useEffect(() => {
    let teamPricingMap = new Map();

    // Initialize every day of the current month with all teams
    let startDate = new Date(currentYear, currentMonth - 1, 1); // Mois en JS commence à 0
    let endDate = new Date(currentYear, currentMonth, 0); // Dernier jour du mois précédent, donc du mois actuel

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      let key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      let teamData = { usedAt: new Date(key).getTime() };
      teams.forEach((team) => {
        teamData[team.name] = 0;
      });
      teamPricingMap.set(key, teamData);
    }

    // Aggregate pricing by team
    tokenRes.forEach((tokenEntry) => {
      let date = new Date(tokenEntry.usedAt);
      let key =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      if (teamPricingMap.has(key)) {
        let currentData = teamPricingMap.get(key);
        currentData[tokenEntry.team_name] += tokenEntry.total_pricing;
        teamPricingMap.set(key, currentData);
      }
    });

    let aggregatedTeamPricing = Array.from(teamPricingMap.values());
    aggregatedTeamPricing.sort((a, b) => a.usedAt - b.usedAt);

    // for (let value of aggregatedTeamPricing.slice(0, 30)) {
    //   value["Sales"] = Math.floor(Math.random() * 20);
    //   value["Admin"] = Math.floor(Math.random() * 20);
    //   value["Marketing"] = Math.floor(Math.random() * 20);
    //   value["IT"] = Math.floor(Math.random() * 20);
    // }

    setTotalPricing(aggregatedTeamPricing);
    // eslint-disable-next-line
  }, [currentMonth, currentYear, tokenRes, teams]);

  useEffect(() => {
    let pricingMap = new Map();

    let validTokenRes = tokenRes.filter((item) => item !== null);
    if (validTokenRes.length > 0) {
      setMinDate(
        new Date(Math.min(...validTokenRes.map((e) => new Date(e.usedAt))))
      );
      setMaxDate(
        new Date(Math.max(...validTokenRes.map((e) => new Date(e.usedAt))))
      );
    }

    for (let tokenEntry of validTokenRes) {
      let date = new Date(tokenEntry.usedAt);
      let key =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

      // Initialiser un objet pour stocker les coûts par modèle
      let costEntry =
        pricingMap.get(key) ||
        Array.from(modelSet).reduce(
          (acc, model) => ({ ...acc, [model]: 0 }),
          {}
        );

      modelSet.forEach((model) => {
        if (model === "fonctions") {
          // Fonctions est un cas spécial, vérifiez la propriété 'function' directement
          costEntry[model] +=
            tokenEntry.function === true ? tokenEntry.total_pricing : 0;
        } else {
          // Vérifier si le modèle est mentionné dans tokenEntry.model et cumuler le coût
          costEntry[model] +=
            tokenEntry.model && tokenEntry.model.includes(model)
              ? tokenEntry.total_pricing
              : 0;
        }
      });

      pricingMap.set(key, costEntry);
    }

    // Le reste du traitement reste identique, convertir simplement modelSet en Array lors de l'itération
    let aggregatedPricing = Array.from(pricingMap, ([usedAt, costs]) => {
      let date = new Date(usedAt);
      let pricingEntry = { usedAt: date.getTime() };
      Array.from(modelSet).forEach((model) => {
        pricingEntry[model] =
          Math.ceil(parseFloat(costs[model] || 0) * 10) / 10;
      });
      return pricingEntry;
    });

    // Complete pricing data for all other days where nothing is found with 0 for each model of modelSet
    let startDate = new Date(currentYear, currentMonth - 1, 1);
    let endDate = new Date(currentYear, currentMonth, 0);

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      let key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      if (!pricingMap.has(key)) {
        let pricingEntry = { usedAt: d.getTime() };
        Array.from(modelSet).forEach((model) => {
          pricingEntry[model] = null; // set null values for each model
        });
        aggregatedPricing.push(pricingEntry);
      }
    }

    aggregatedPricing.sort((a, b) => a.usedAt - b.usedAt);

    // Filter usage data for the current month
    aggregatedPricing = aggregatedPricing.filter(
      (item) =>
        new Date(item.usedAt).getFullYear() === currentYear &&
        new Date(item.usedAt).getMonth() + 1 === currentMonth
    );

    // Randomize pricingMap values for testing purposes
    // for (let value of aggregatedPricing.slice(0, 30)) {
    //   for (let model of modelSetArray) {
    //     value[model] = Math.floor(Math.random() * 100);
    //   }
    // }


    setChartPricing(aggregatedPricing);
    // eslint-disable-next-line
  }, [currentMonth, currentYear, tokenRes]);

  const incrementMonth = () => {
    const nextMonth = new Date(currentYear, currentMonth % 12, 1);
    if (nextMonth < maxDate) {
      if (currentMonth === 12) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const decrementMonth = () => {
    const previousMonth = new Date(
      currentMonth === 1 ? currentYear - 1 : currentYear,
      (currentMonth - 1 + 12) % 12,
      1
    );
    previousMonth.setHours(23);
    previousMonth.setMinutes(59);
    previousMonth.setSeconds(59);
    previousMonth.setMilliseconds(999);
    if (previousMonth >= minDate) {
      if (currentMonth === 1) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(12);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const nextMonthExists = new Date(currentYear, currentMonth % 12, 1) < maxDate;
  const previousMonthExists =
    new Date(
      currentMonth === 1 ? currentYear - 1 : currentYear,
      (currentMonth - 2 + 12) % 12,
      0
    ) >= minDate;

  return (
    <>
      <div className="month">
        <div
          className="left"
          onClick={decrementMonth}
          disabled={!previousMonthExists}
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="double-left-arrow h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="11 4 4 12 11 20"></polyline>
            <polyline points="19 4 12 12 19 20"></polyline>
          </svg>
        </div>
        <div className="label">
          {`${new Date(currentYear, currentMonth - 1)
            .toLocaleDateString("fr-fr", { month: "long", year: "numeric" })
            .toUpperCase()}`}
        </div>
        <div
          className="right"
          onClick={incrementMonth}
          disabled={!nextMonthExists}
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="double-right-arrow h-4 w-4"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polyline points="13 4 20 12 13 20"></polyline>
            <polyline points="5 4 12 12 5 20"></polyline>
          </svg>
        </div>
      </div>
      <h2>Consommation globale en $</h2>
      <div className="token-usage">
        <ResponsiveContainer width="100%" height={300}>
          {isLoading ? (
            <div className="chart-placeholder">
              <div className="spinner"></div>
            </div>
          ) : (
            <BarChart
              width={500}
              height={300}
              data={chartPricing}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                className="grid"
                strokeDasharray="0"
                strokeWidth={0.2}
              />{" "}
              <XAxis
                dataKey="usedAt"
                domain={["auto", "auto"]}
                name="Date"
                tickFormatter={(unixTime) =>
                  new Date(unixTime).toLocaleDateString("fr-FR", {
                    day: "numeric",
                  })
                }
                type="number"
                scale="time"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {modelSetArray &&
                modelSetArray.length > 0 &&
                modelSetArray.map((model, index) => {
                  const barElement = (
                    <Bar
                      key={index}
                      dataKey={model}
                      stackId="a"
                      fill={colors[index % colors.length]}
                    />
                  );
                  return barElement;
                })}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <h2>Consommation par équipes en $</h2>
      <div className="token-usage">
        <ResponsiveContainer width="100%" height={300}>
          {isLoading ? (
            <div className="chart-placeholder">
              <div className="spinner"></div>
            </div>
          ) : (
            <LineChart
              data={totaltPricing}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                className="grid"
                strokeDasharray="0"
                strokeWidth={0.2}
              />
              <XAxis
                dataKey="usedAt"
                domain={["auto", "auto"]}
                name="Date"
                tickFormatter={(unixTime) =>
                  new Date(unixTime).toLocaleDateString("fr-FR", {
                    day: "numeric",
                  })
                }
                type="number"
                scale="time"
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {teams &&
                teams.map((team, index) => {
                  const lineProps = index === 1 ? { activeDot: { r: 8 } } : {};
                  return (
                    <Line
                      key={index}
                      className="global-line"
                      type="monotone"
                      stroke={colors[index % colors.length]}
                      dataKey={team.name}
                      {...lineProps}
                    />
                  );
                })}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ChartUsage;
