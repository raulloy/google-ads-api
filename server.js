import express from 'express';
import cors from 'cors';
import config from './config.js';
import { GoogleAdsApi } from 'google-ads-api';
import asyncHandler from 'express-async-handler';

const app = express();
app.use(cors());

const clientID = config.CLIENT_ID;
const clientSecret = config.CLIENT_SECRET;
const devToken = config.DEVELOPER_TOKEN;
const customerID = config.CUSTOMER_ID;
const refreshToken = config.REFRESH_TOKEN;

const client = new GoogleAdsApi({
  client_id: clientID,
  client_secret: clientSecret,
  developer_token: devToken,
});

const customer = client.Customer({
  customer_id: customerID,
  refresh_token: refreshToken,
});

app.get(
  '/api/google-campaigns',
  asyncHandler(async (req, res) => {
    const { since, until } = req.query;

    try {
      const campaigns = await customer.report({
        entity: 'campaign',
        attributes: [
          'campaign.id',
          'campaign.name',
          'campaign.advertising_channel_type',
          'metrics.cost_micros',
          'metrics.impressions',
          'metrics.clicks',
          'metrics.ctr',
          'metrics.average_cpc',
          'metrics.conversions',
          'metrics.cost_per_conversion',
        ],
        constraints: [
          `segments.date BETWEEN '${since}' AND '${until}'`,
          'campaign.status = "ENABLED"',
        ],
        limit: 50,
      });

      res.send(campaigns);
    } catch (error) {
      res.status(500).send(error);
    }
  })
);

app.get(
  '/api/google-ad_groups',
  asyncHandler(async (req, res) => {
    const { since, until } = req.query;

    try {
      const adsets = await customer.report({
        entity: 'ad_group',
        attributes: [
          'ad_group.id',
          'ad_group.name',
          'ad_group.campaign',
          'ad_group.type',
        ],
        metrics: [
          'metrics.cost_micros',
          'metrics.impressions',
          'metrics.clicks',
          'metrics.ctr',
          'metrics.average_cpc',
          'metrics.conversions',
          'metrics.cost_per_conversion',
        ],
        constraints: [
          `segments.date BETWEEN '${since}' AND '${until}'`,
          'ad_group.status = "ENABLED"',
          'metrics.cost_micros > 0',
        ],
        limit: 100,
      });

      res.send(adsets);
    } catch (error) {
      res.status(500).send(error);
    }
  })
);

app.listen(config.PORT, () => {
  console.log(`Server is listening on port ${config.PORT}`);
});
