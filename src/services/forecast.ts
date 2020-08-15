import { StormGlass, ForecastPoint } from '@src/clients/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

// eslint-disable-next-line prettier/prettier
export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  protected stormGlass: StormGlass;

  constructor(stormGlass = new StormGlass()) {
    this.stormGlass = stormGlass;
  }

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = [];

      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }

    return forecastByTime;
  }
}
