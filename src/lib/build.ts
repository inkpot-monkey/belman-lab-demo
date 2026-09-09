/**
 * Which revision of the source this build came from.
 *
 * A site that says it is generated from a repository should be able to say
 * which commit, the way any other instrument prints its firmware version. It
 * is also the honest answer to "is what I just published live yet".
 *
 * Read from git rather than stamped with a clock, so two builds of the same
 * commit produce the same page - the same reason publications come from a
 * committed ORCID snapshot. Where git is unavailable - a tarball, a sandbox
 * with no `.git` - there is simply no revision, and the line is not shown.
 */
import { execFileSync } from 'node:child_process';

function git(...args: string[]): string | undefined {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined;
  } catch {
    return undefined;
  }
}

export interface Revision {
  /** Abbreviated commit hash. */
  hash: string;
  /** Commit date as `YYYY-MM-DD`, in the committer's own offset. */
  date: string;
}

/** The commit this build was made from, or undefined outside a checkout. */
export const revision: Revision | undefined = (() => {
  const hash = git('rev-parse', '--short', 'HEAD');
  const date = git('log', '-1', '--format=%cs');
  return hash && date ? { hash, date } : undefined;
})();
