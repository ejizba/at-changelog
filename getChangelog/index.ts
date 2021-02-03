import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as octokit from '@octokit/rest';
import * as dayjs from 'dayjs';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const token = process.env['GITHUB_RO_PAT']; // only needed to increase rate-limit
    const client = new octokit.Octokit({ auth: token });

    const name = req.query['name'];
    if (!name) {
        context.res = {
            body: 'You must pass a "name" on the query, for example "ui", "appservice", or "kudu".'
        };
        return;
    }

    const releases = await client.paginate(client.repos.listReleases, { owner: 'Microsoft', repo: 'vscode-azuretools' });

    let changelog: string = '';
    for (const release of releases) {
        const match = release.tag_name.match(/([^-]*)-(.*)/)
        if (!match) {
            console.log(`Unexpected tag format "${release.tag_name}"`)
        } else {
            const [, relVersion, relName] = match;
            if (relName === name) {
                const date: string = dayjs(release.published_at).format('YYYY-MM-DD');
                changelog += `## ${relVersion} - ${date}\n\n`;
                changelog += release.body;
                changelog += '\n\n';
            }
        }
    }

    context.res = {
        body: changelog
    };

};

export default httpTrigger;